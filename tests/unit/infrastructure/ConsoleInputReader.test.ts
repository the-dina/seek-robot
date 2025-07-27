import * as readline from "readline";
import { ConsoleInputReader } from "src/infrastructure/ConsoleInputReader";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock readline module
vi.mock("readline");

interface IMockReadlineInterface {
  on: ReturnType<typeof vi.fn>;
  prompt: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
}

describe("ConsoleInputReader", () => {
  let consoleInputReader: ConsoleInputReader;
  let mockInterface: IMockReadlineInterface;

  beforeEach(() => {
    mockInterface = {
      on: vi.fn(),
      prompt: vi.fn(),
      close: vi.fn(),
    };

    vi.mocked(readline.createInterface).mockReturnValue(mockInterface as any);
    consoleInputReader = new ConsoleInputReader();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should create readline interface with correct options", () => {
      expect(readline.createInterface).toHaveBeenCalledWith({
        input: process.stdin,
        output: process.stdout,
        prompt: "> ",
      });
    });
  });

  describe("readLine", () => {
    it("should return null when queue is empty", () => {
      const result = consoleInputReader.readLine();
      expect(result).toBeNull();
    });
  });

  describe("hasMoreInput", () => {
    it("should return true when not reading", () => {
      expect(consoleInputReader.hasMoreInput()).toBe(true);
    });
  });

  describe("startReading", () => {
    it("should set up event listeners and prompt", () => {
      consoleInputReader.startReading();

      expect(mockInterface.on).toHaveBeenCalledWith(
        "line",
        expect.any(Function)
      );
      expect(mockInterface.on).toHaveBeenCalledWith(
        "close",
        expect.any(Function)
      );
      expect(mockInterface.prompt).toHaveBeenCalled();
    });
  });

  describe("getQueuedCommands", () => {
    it("should return empty array initially", () => {
      const commands = consoleInputReader.getQueuedCommands();
      expect(commands).toEqual([]);
    });
  });

  describe("onCommand", () => {
    it("should set command callback without error", () => {
      const callback = vi.fn();
      expect(() => consoleInputReader.onCommand(callback)).not.toThrow();
    });
  });

  describe("close", () => {
    it("should close readline interface", () => {
      consoleInputReader.close();
      expect(mockInterface.close).toHaveBeenCalled();
    });
  });

  describe("prompt", () => {
    it("should not call readline prompt when not reading", () => {
      consoleInputReader.prompt();
      expect(mockInterface.prompt).toHaveBeenCalledTimes(0);
    });

    it("should call readline prompt when reading", async () => {
      // Start reading to set isReading to true
      consoleInputReader.startReading();

      // Call prompt while reading
      consoleInputReader.prompt();

      expect(mockInterface.prompt).toHaveBeenCalled();

      // Clean up by closing
      consoleInputReader.close();
    });
  });

  describe("integration with readline events", () => {
    let lineHandler: Function;
    let closeHandler: Function;
    let originalExit: typeof process.exit;

    beforeEach(async () => {
      originalExit = process.exit;
      process.exit = vi.fn() as any;

      // Capture the event handlers
      mockInterface.on.mockImplementation(
        (event: string, callback: Function) => {
          if (event === "line") lineHandler = callback;
          if (event === "close") closeHandler = callback;
        }
      );

      // Start reading to set up handlers
      consoleInputReader.startReading();
    });

    afterEach(() => {
      process.exit = originalExit;
    });

    it("should process line input and add to queue", () => {
      lineHandler("test command");

      const result = consoleInputReader.readLine();
      expect(result).toBe("test command");
    });

    it("should trim input", () => {
      lineHandler("  test command  ");

      const result = consoleInputReader.readLine();
      expect(result).toBe("test command");
    });

    it("should exit on EXIT command", () => {
      lineHandler("EXIT");
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("should exit on QUIT command", () => {
      lineHandler("QUIT");
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("should exit on case-insensitive exit commands", () => {
      lineHandler("exit");
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("should call callback when command callback is set", () => {
      const callback = vi.fn();
      consoleInputReader.onCommand(callback);

      lineHandler("test command");
      expect(callback).toHaveBeenCalledWith("test command");
    });

    it("should queue commands when no callback is set", () => {
      // Ensure no callback is set
      expect(consoleInputReader.readLine()).toBeNull();

      // Handle line without callback
      lineHandler("queued command");

      // Command should be available via readLine
      expect(consoleInputReader.readLine()).toBe("queued command");
    });

    it("should return queued commands", () => {
      lineHandler("command1");
      lineHandler("command2");

      const commands = consoleInputReader.getQueuedCommands();
      expect(commands).toEqual(["command1", "command2"]);
    });

    it("should handle close event and resolve promise", async () => {
      // Start reading which returns a promise
      const readingPromise = consoleInputReader.startReading();

      // Trigger the close handler
      closeHandler();

      // The promise should resolve
      await expect(readingPromise).resolves.toBeUndefined();
    });
  });
});
