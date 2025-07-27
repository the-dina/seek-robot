import { CommandParser } from "src/application/CommandParser";
import { ICommand } from "src/application/commands/ICommand";
import { PlaceCommand } from "src/application/commands/PlaceCommand";
import { ReportCommand } from "src/application/commands/ReportCommand";
import { Robot } from "src/domain/Robot";
import { ICommandResult, IOutputWriter } from "src/types";

export class CommandProcessor {
  private readonly commandParser: CommandParser;
  private hasValidPlaceCommand: boolean = false;

  constructor(
    private readonly robot: Robot,
    private readonly outputWriter: IOutputWriter
  ) {
    this.commandParser = new CommandParser();
  }

  processCommand(commandString: string): ICommandResult {
    const command = this.commandParser.parseCommand(commandString);

    if (!command) {
      return this.createInvalidCommandResult(commandString);
    }

    if (!this.canExecuteCommand(command)) {
      return this.handleUnplacedRobotCommand();
    }

    const result = command.execute(this.robot);

    this.updatePlacementState(command, result);
    this.handleCommandOutput(command, result);

    return result;
  }

  private createInvalidCommandResult(commandString: string): ICommandResult {
    return {
      success: false,
      error: `Invalid command: ${commandString.trim()}`,
    };
  }

  private canExecuteCommand(command: ICommand): boolean {
    return this.hasValidPlaceCommand || command instanceof PlaceCommand;
  }

  private handleUnplacedRobotCommand(): ICommandResult {
    this.outputWriter.writeWarning(
      "Command ignored: Robot must be placed on the table before executing other commands"
    );
    return {
      success: true,
    };
  }

  private updatePlacementState(
    command: ICommand,
    result: ICommandResult
  ): void {
    if (result.success && command instanceof PlaceCommand) {
      this.hasValidPlaceCommand = true;
    }
  }

  private handleCommandOutput(command: ICommand, result: ICommandResult): void {
    if (result.output) {
      if (command instanceof ReportCommand) {
        this.outputWriter.writeReport(result.output);
      } else {
        this.outputWriter.write(result.output);
      }
    }
  }

  processCommands(commands: string[]): ICommandResult[] {
    return commands.map((command) => this.processCommand(command));
  }

  reset(): void {
    this.hasValidPlaceCommand = false;
  }
}
