import { CommandProcessor } from "src/application/CommandProcessor";
import { Robot } from "src/domain/Robot";
import { Table } from "src/domain/Table";
import { ConsoleInputReader } from "src/infrastructure/ConsoleInputReader";
import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";
import { FileInputReader } from "src/infrastructure/FileInputReader";

export class RobotApplication {
  private readonly table: Table;
  private readonly robot: Robot;
  private readonly outputWriter: ConsoleOutputWriter;
  private commandProcessor: CommandProcessor;

  constructor() {
    this.table = new Table(5, 5);
    this.robot = new Robot(this.table);
    this.outputWriter = new ConsoleOutputWriter();
    this.commandProcessor = new CommandProcessor(this.robot, this.outputWriter);
  }

  async runInteractive(): Promise<void> {
    const inputReader = new ConsoleInputReader();

    this.displayStartupMessage();
    this.setupSignalHandlers(inputReader);

    try {
      inputReader.onCommand((command) => {
        this.handleCommand(command);
        inputReader.prompt();
      });

      await inputReader.startReading();
    } catch (error) {
      this.outputWriter.writeError(
        "An error occurred: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      inputReader.close();
    }
  }

  runFromFile(filePath: string): void {
    try {
      const inputReader = new FileInputReader(filePath);

      this.outputWriter.writeInfo(`Reading commands from: ${filePath}`);
      this.outputWriter.write("");

      let command: string | null;
      while ((command = inputReader.readLine()) !== null) {
        this.outputWriter.writeCommand(`> ${command}`);
        this.handleCommand(command);
      }

      this.outputWriter.write("");
      this.outputWriter.writeSuccess("File processing completed.");
    } catch (error) {
      this.outputWriter.writeError(
        "Failed to process file: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      process.exit(1);
    }
  }

  processCommand(command: string): void {
    const result = this.commandProcessor.processCommand(command);
    if (!result.success && result.error) {
      this.outputWriter.writeError(`Error: ${result.error}`);
    }
  }

  reset(): void {
    this.commandProcessor.reset();
  }

  private displayStartupMessage(): void {
    this.outputWriter.writeSuccess("Robot Simulation Started");
    this.outputWriter.writeInfo(
      "Available commands: PLACE X,Y,F | MOVE | LEFT | RIGHT | REPORT"
    );
    this.outputWriter.writeInfo("Type EXIT or QUIT to exit, or press Ctrl+C");
    this.outputWriter.writeInfo(
      "Commands are case-insensitive (e.g., 'place', 'PLACE', 'Place' all work)"
    );
    this.outputWriter.writeInfo(
      "Valid directions for F parameter: NORTH, SOUTH, EAST, WEST"
    );
    this.outputWriter.writeWarning(
      "Note: Robot must be placed on the table before other commands can be executed."
    );
    this.outputWriter.write("");
  }

  private setupSignalHandlers(inputReader: ConsoleInputReader): void {
    process.on("SIGINT", () => {
      this.outputWriter.writeInfo("\nShutting down...");
      inputReader.close();
      process.exit(0);
    });
  }

  private handleCommand(command: string): void {
    const result = this.commandProcessor.processCommand(command);
    if (!result.success && result.error) {
      this.outputWriter.writeError(`Error: ${result.error}`);
    }
  }
}

async function main(): Promise<void> {
  const app = new RobotApplication();
  const args = process.argv.slice(2);

  if (args.length > 0) {
    const filePath = args[0];
    app.runFromFile(filePath);
  } else {
    await app.runInteractive();
  }
}

export { main };
