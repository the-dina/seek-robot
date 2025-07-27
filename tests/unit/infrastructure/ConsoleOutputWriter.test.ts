import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ConsoleOutputWriter", () => {
  let consoleOutputWriter: ConsoleOutputWriter;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleOutputWriter = new ConsoleOutputWriter();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("write", () => {
    it("should write message to console", () => {
      const message = "Test message";
      consoleOutputWriter.write(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });
  });

  describe("writeError", () => {
    it("should write error message with red color", () => {
      const message = "Error message";
      consoleOutputWriter.writeError(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(`\x1b[31m${message}\x1b[0m`);
    });
  });

  describe("writeSuccess", () => {
    it("should write success message with green color", () => {
      const message = "Success message";
      consoleOutputWriter.writeSuccess(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(`\x1b[32m${message}\x1b[0m`);
    });
  });

  describe("writeInfo", () => {
    it("should write info message with cyan color", () => {
      const message = "Info message";
      consoleOutputWriter.writeInfo(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(`\x1b[36m${message}\x1b[0m`);
    });
  });

  describe("writeWarning", () => {
    it("should write warning message with yellow color", () => {
      const message = "Warning message";
      consoleOutputWriter.writeWarning(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(`\x1b[33m${message}\x1b[0m`);
    });
  });

  describe("writeCommand", () => {
    it("should write command message with gray color", () => {
      const message = "Command message";
      consoleOutputWriter.writeCommand(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(`\x1b[90m${message}\x1b[0m`);
    });
  });

  describe("writeReport", () => {
    it("should write report message with bright magenta color", () => {
      const message = "Report message";
      consoleOutputWriter.writeReport(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        `\x1b[1m\x1b[35m${message}\x1b[0m`
      );
    });
  });
});
