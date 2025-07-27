import { RobotApplication, main } from "src/app";
import { CommandProcessor } from "src/application/CommandProcessor";
import { Robot } from "src/domain/Robot";
import { Table } from "src/domain/Table";
import { ConsoleInputReader } from "src/infrastructure/ConsoleInputReader";
import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";
import { FileInputReader } from "src/infrastructure/FileInputReader";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock all dependencies
vi.mock("src/domain/Table");
vi.mock("src/domain/Robot");
vi.mock("src/infrastructure/ConsoleOutputWriter");
vi.mock("src/application/CommandProcessor");
vi.mock("src/infrastructure/ConsoleInputReader");
vi.mock("src/infrastructure/FileInputReader");

describe("RobotApplication", () => {
  let mockOutputWriter: any;
  let mockCommandProcessor: any;
  let mockConsoleInputReader: any;
  let mockFileInputReader: any;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    mockOutputWriter = {
      writeError: vi.fn(),
      writeInfo: vi.fn(),
      writeSuccess: vi.fn(),
      writeWarning: vi.fn(),
      writeCommand: vi.fn(),
      write: vi.fn(),
    };

    mockCommandProcessor = {
      processCommand: vi.fn().mockReturnValue({ success: true }),
      reset: vi.fn(),
    };

    mockConsoleInputReader = {
      onCommand: vi.fn(),
      startReading: vi.fn().mockResolvedValue(undefined),
      close: vi.fn(),
      prompt: vi.fn(),
    };

    mockFileInputReader = {
      readLine: vi.fn().mockReturnValue(null),
    };

    // Mock constructors
    vi.mocked(Table).mockImplementation(() => ({} as any));
    vi.mocked(Robot).mockImplementation(() => ({} as any));
    vi.mocked(ConsoleOutputWriter).mockImplementation(() => mockOutputWriter);
    vi.mocked(CommandProcessor).mockImplementation(() => mockCommandProcessor);
    vi.mocked(ConsoleInputReader).mockImplementation(
      () => mockConsoleInputReader
    );
    vi.mocked(FileInputReader).mockImplementation(() => mockFileInputReader);
  });

  describe("constructor", () => {
    it("should initialize with correct dependencies", () => {
      new RobotApplication();

      expect(Table).toHaveBeenCalledWith(5, 5);
      expect(Robot).toHaveBeenCalled();
      expect(ConsoleOutputWriter).toHaveBeenCalled();
      expect(CommandProcessor).toHaveBeenCalled();
    });
  });

  describe("runInteractive", () => {
    let mockProcessExit: any;
    let mockProcessOn: any;

    beforeEach(() => {
      mockProcessExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
      mockProcessOn = vi.spyOn(process, "on").mockImplementation(() => process);
    });

    afterEach(() => {
      mockProcessExit.mockRestore();
      mockProcessOn.mockRestore();
    });

    it("should display startup message and setup signal handlers", async () => {
      const app = new RobotApplication();
      await app.runInteractive();

      expect(mockOutputWriter.writeSuccess).toHaveBeenCalledWith(
        "Robot Simulation Started"
      );
      expect(mockOutputWriter.writeInfo).toHaveBeenCalledWith(
        "Available commands: PLACE X,Y,F | MOVE | LEFT | RIGHT | REPORT"
      );
      expect(mockOutputWriter.writeInfo).toHaveBeenCalledWith(
        "Type EXIT or QUIT to exit, or press Ctrl+C"
      );
      expect(mockOutputWriter.writeWarning).toHaveBeenCalledWith(
        "Note: Robot must be placed on the table before other commands can be executed."
      );
      expect(mockOutputWriter.write).toHaveBeenCalledWith("");
      expect(mockProcessOn).toHaveBeenCalledWith(
        "SIGINT",
        expect.any(Function)
      );
    });

    it("should setup command handler and start reading", async () => {
      const app = new RobotApplication();
      await app.runInteractive();

      expect(mockConsoleInputReader.onCommand).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(mockConsoleInputReader.startReading).toHaveBeenCalled();
      expect(mockConsoleInputReader.close).toHaveBeenCalled();
    });

    it("should handle command processing in the command handler", async () => {
      const app = new RobotApplication();
      let commandHandler: any;
      mockConsoleInputReader.onCommand.mockImplementation((handler: any) => {
        commandHandler = handler;
      });

      await app.runInteractive();

      commandHandler("MOVE");
      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith("MOVE");
      expect(mockConsoleInputReader.prompt).toHaveBeenCalled();
    });

    it("should handle command processing error in the command handler", async () => {
      const app = new RobotApplication();
      let commandHandler: any;
      mockConsoleInputReader.onCommand.mockImplementation((handler: any) => {
        commandHandler = handler;
      });
      mockCommandProcessor.processCommand.mockReturnValue({
        success: false,
        error: "Invalid command",
      });

      await app.runInteractive();

      commandHandler("INVALID");
      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith(
        "INVALID"
      );
      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "Error: Invalid command"
      );
    });

    it("should handle errors during interactive session", async () => {
      const app = new RobotApplication();
      const error = new Error("Test error");
      mockConsoleInputReader.startReading.mockRejectedValue(error);

      await app.runInteractive();

      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "An error occurred: Test error"
      );
      expect(mockConsoleInputReader.close).toHaveBeenCalled();
    });

    it("should handle unknown errors during interactive session", async () => {
      const app = new RobotApplication();
      mockConsoleInputReader.startReading.mockRejectedValue("Unknown error");

      await app.runInteractive();

      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "An error occurred: Unknown error"
      );
    });

    it("should handle SIGINT signal correctly", async () => {
      const app = new RobotApplication();
      let sigintHandler: any;
      mockProcessOn.mockImplementation((event: any, handler: any) => {
        if (event === "SIGINT") {
          sigintHandler = handler;
        }
        return process;
      });

      await app.runInteractive();

      sigintHandler();
      expect(mockOutputWriter.writeInfo).toHaveBeenCalledWith(
        "\nShutting down..."
      );
      expect(mockConsoleInputReader.close).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalledWith(0);
    });
  });

  describe("runFromFile", () => {
    let mockProcessExit: any;

    beforeEach(() => {
      mockProcessExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
    });

    afterEach(() => {
      mockProcessExit.mockRestore();
    });

    it("should process file successfully with no commands", () => {
      const app = new RobotApplication();
      const filePath = "/path/to/test.txt";
      mockFileInputReader.readLine.mockReturnValue(null);

      app.runFromFile(filePath);

      expect(FileInputReader).toHaveBeenCalledWith(filePath);
      expect(mockOutputWriter.writeInfo).toHaveBeenCalledWith(
        `Reading commands from: ${filePath}`
      );
      expect(mockOutputWriter.write).toHaveBeenCalledWith("");
      expect(mockOutputWriter.writeSuccess).toHaveBeenCalledWith(
        "File processing completed."
      );
    });

    it("should process file with multiple commands", () => {
      const app = new RobotApplication();
      const filePath = "/path/to/test.txt";
      const commands = ["PLACE 0,0,NORTH", "MOVE", "REPORT"];
      let callCount = 0;

      mockFileInputReader.readLine.mockImplementation(() => {
        if (callCount < commands.length) {
          return commands[callCount++];
        }
        return null;
      });

      app.runFromFile(filePath);

      expect(mockOutputWriter.writeCommand).toHaveBeenCalledWith(
        "> PLACE 0,0,NORTH"
      );
      expect(mockOutputWriter.writeCommand).toHaveBeenCalledWith("> MOVE");
      expect(mockOutputWriter.writeCommand).toHaveBeenCalledWith("> REPORT");
      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith(
        "PLACE 0,0,NORTH"
      );
      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith("MOVE");
      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith(
        "REPORT"
      );
      expect(mockCommandProcessor.processCommand).toHaveBeenCalledTimes(3);
    });

    it("should handle file processing errors", () => {
      const filePath = "/path/to/nonexistent.txt";
      const error = new Error("File not found");

      vi.mocked(FileInputReader).mockImplementationOnce(() => {
        throw error;
      });

      const app = new RobotApplication();
      app.runFromFile(filePath);

      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "Failed to process file: File not found"
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    it("should handle unknown file processing errors", () => {
      const filePath = "/path/to/test.txt";

      vi.mocked(FileInputReader).mockImplementationOnce(() => {
        throw "Unknown error";
      });

      const app = new RobotApplication();
      app.runFromFile(filePath);

      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "Failed to process file: Unknown error"
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe("processCommand", () => {
    it("should process command successfully", () => {
      const app = new RobotApplication();
      mockCommandProcessor.processCommand.mockReturnValue({ success: true });

      app.processCommand("MOVE");

      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith("MOVE");
      expect(mockOutputWriter.writeError).not.toHaveBeenCalled();
    });

    it("should handle command processing errors", () => {
      const app = new RobotApplication();
      mockCommandProcessor.processCommand.mockReturnValue({
        success: false,
        error: "Invalid command",
      });

      app.processCommand("INVALID");

      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith(
        "INVALID"
      );
      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "Error: Invalid command"
      );
    });

    it("should handle command processing errors without error message", () => {
      const app = new RobotApplication();
      mockCommandProcessor.processCommand.mockReturnValue({
        success: false,
      });

      app.processCommand("INVALID");

      expect(mockCommandProcessor.processCommand).toHaveBeenCalledWith(
        "INVALID"
      );
      expect(mockOutputWriter.writeError).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should reset the command processor", () => {
      const app = new RobotApplication();
      app.reset();

      expect(mockCommandProcessor.reset).toHaveBeenCalled();
    });
  });
});

describe("main function", () => {
  let originalArgv: string[];

  beforeEach(() => {
    // Save original process.argv
    originalArgv = process.argv.slice();
  });

  afterEach(() => {
    // Restore original process.argv
    process.argv = originalArgv;
  });

  it("should run from file when file path is provided", async () => {
    // Mock process.argv to include a file path
    process.argv = ["node", "script.js", "test-file.txt"];

    // Create a spy on the RobotApplication class methods
    const runFromFileSpy = vi
      .spyOn(RobotApplication.prototype, "runFromFile")
      .mockImplementation(() => {});
    const runInteractiveSpy = vi
      .spyOn(RobotApplication.prototype, "runInteractive")
      .mockImplementation(async () => {});

    await main();

    expect(runFromFileSpy).toHaveBeenCalledWith("test-file.txt");
    expect(runInteractiveSpy).not.toHaveBeenCalled();

    runFromFileSpy.mockRestore();
    runInteractiveSpy.mockRestore();
  });

  it("should run interactive mode when no file path is provided", async () => {
    // Mock process.argv with no additional arguments
    process.argv = ["node", "script.js"];

    // Create a spy on the RobotApplication class methods
    const runFromFileSpy = vi
      .spyOn(RobotApplication.prototype, "runFromFile")
      .mockImplementation(() => {});
    const runInteractiveSpy = vi
      .spyOn(RobotApplication.prototype, "runInteractive")
      .mockImplementation(async () => {});

    await main();

    expect(runInteractiveSpy).toHaveBeenCalled();
    expect(runFromFileSpy).not.toHaveBeenCalled();

    runFromFileSpy.mockRestore();
    runInteractiveSpy.mockRestore();
  });

  it("should run interactive mode when empty arguments array", async () => {
    // Mock process.argv with empty arguments
    process.argv = ["node"];

    // Create a spy on the RobotApplication class methods
    const runFromFileSpy = vi
      .spyOn(RobotApplication.prototype, "runFromFile")
      .mockImplementation(() => {});
    const runInteractiveSpy = vi
      .spyOn(RobotApplication.prototype, "runInteractive")
      .mockImplementation(async () => {});

    await main();

    expect(runInteractiveSpy).toHaveBeenCalled();
    expect(runFromFileSpy).not.toHaveBeenCalled();

    runFromFileSpy.mockRestore();
    runInteractiveSpy.mockRestore();
  });
});
