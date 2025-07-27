import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies before importing the module
vi.mock("src/app", () => ({
  main: vi.fn(),
}));
vi.mock("src/infrastructure/ConsoleOutputWriter");

describe("index", () => {
  let mockMain: any;
  let mockOutputWriter: any;
  let mockProcessExit: any;
  let MockedConsoleOutputWriter: any;

  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Get the mocked main function
    const { main } = await import("src/app");
    mockMain = vi.mocked(main);

    // Setup mock for ConsoleOutputWriter
    mockOutputWriter = {
      writeError: vi.fn(),
    };

    const ConsoleOutputWriterModule = await import(
      "src/infrastructure/ConsoleOutputWriter"
    );
    MockedConsoleOutputWriter = vi.mocked(
      ConsoleOutputWriterModule.ConsoleOutputWriter
    );
    MockedConsoleOutputWriter.mockImplementation(() => mockOutputWriter);

    // Setup mock for process.exit
    mockProcessExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    mockProcessExit.mockRestore();
  });

  describe("module execution", () => {
    it("should handle successful main execution without errors", async () => {
      // Mock main to resolve successfully
      mockMain.mockResolvedValue(undefined);

      // Actually import the index module to trigger execution
      await import("src/index");

      expect(mockMain).toHaveBeenCalled();
      expect(mockOutputWriter.writeError).not.toHaveBeenCalled();
      expect(mockProcessExit).not.toHaveBeenCalled();
    });

    it("should handle main function throwing an Error", async () => {
      const error = new Error("Main function failed");
      mockMain.mockRejectedValue(error);

      // Reset modules to allow re-import
      vi.resetModules();

      // Actually import the index module to trigger execution
      await import("src/index");

      // Wait a bit for the async error handling
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockMain).toHaveBeenCalled();
      expect(MockedConsoleOutputWriter).toHaveBeenCalled();
      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "Fatal error: Main function failed"
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    it("should handle main function throwing a non-Error", async () => {
      const error = "String error";
      mockMain.mockRejectedValue(error);

      // Reset modules to allow re-import
      vi.resetModules();

      // Actually import the index module to trigger execution
      await import("src/index");

      // Wait a bit for the async error handling
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockMain).toHaveBeenCalled();
      expect(MockedConsoleOutputWriter).toHaveBeenCalled();
      expect(mockOutputWriter.writeError).toHaveBeenCalledWith(
        "Fatal error: Unknown error"
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });
});
