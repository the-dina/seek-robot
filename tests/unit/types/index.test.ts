import {
  BaseError,
  ErrorNames,
  InvalidArgumentError,
  type ErrorName,
  type ICommandResult,
  type IInputReader,
  type IInteractiveInputReader,
  type IOutputWriter,
} from "src/types";
import { describe, expect, it } from "vitest";

describe("types module", () => {
  describe("interfaces", () => {
    it("should define IOutputWriter interface", () => {
      // Test that the interface can be used as a type
      const mockOutputWriter: IOutputWriter = {
        write: () => {},
        writeError: () => {},
        writeSuccess: () => {},
        writeInfo: () => {},
        writeWarning: () => {},
        writeCommand: () => {},
        writeReport: () => {},
      };

      expect(mockOutputWriter).toBeDefined();
      expect(typeof mockOutputWriter.write).toBe("function");
      expect(typeof mockOutputWriter.writeError).toBe("function");
      expect(typeof mockOutputWriter.writeSuccess).toBe("function");
      expect(typeof mockOutputWriter.writeInfo).toBe("function");
      expect(typeof mockOutputWriter.writeWarning).toBe("function");
      expect(typeof mockOutputWriter.writeCommand).toBe("function");
      expect(typeof mockOutputWriter.writeReport).toBe("function");
    });

    it("should define IInputReader interface", () => {
      // Test that the interface can be used as a type
      const mockInputReader: IInputReader = {
        readLine: () => null,
        hasMoreInput: () => false,
      };

      expect(mockInputReader).toBeDefined();
      expect(typeof mockInputReader.readLine).toBe("function");
      expect(typeof mockInputReader.hasMoreInput).toBe("function");
    });

    it("should define IInteractiveInputReader interface", () => {
      // Test that the interface can be used as a type
      const mockInteractiveInputReader: IInteractiveInputReader = {
        readLine: () => null,
        hasMoreInput: () => false,
        onCommand: () => {},
      };

      expect(mockInteractiveInputReader).toBeDefined();
      expect(typeof mockInteractiveInputReader.readLine).toBe("function");
      expect(typeof mockInteractiveInputReader.hasMoreInput).toBe("function");
      expect(typeof mockInteractiveInputReader.onCommand).toBe("function");
    });

    it("should define ICommandResult interface", () => {
      // Test that the interface can be used as a type
      const mockCommandResult: ICommandResult = {
        success: true,
        output: "test output",
        error: "test error",
      };

      expect(mockCommandResult).toBeDefined();
      expect(typeof mockCommandResult.success).toBe("boolean");
      expect(typeof mockCommandResult.output).toBe("string");
      expect(typeof mockCommandResult.error).toBe("string");
    });
  });

  describe("error exports", () => {
    it("should export BaseError class", () => {
      expect(BaseError).toBeDefined();
      expect(typeof BaseError).toBe("function");
      // BaseError is abstract, so we test through InvalidArgumentError
    });

    it("should export ErrorNames object", () => {
      expect(ErrorNames).toBeDefined();
      expect(typeof ErrorNames).toBe("object");
      expect(ErrorNames.INVALID_ARGUMENT).toBe("InvalidArgumentError");
    });

    it("should export InvalidArgumentError class", () => {
      expect(InvalidArgumentError).toBeDefined();
      expect(typeof InvalidArgumentError).toBe("function");

      const error = new InvalidArgumentError("testArg", "invalidValue");
      expect(error).toBeInstanceOf(InvalidArgumentError);
      expect(error).toBeInstanceOf(BaseError);
      expect(error.name).toBe("InvalidArgumentError");
      expect(error.message).toBe("Invalid testArg: invalidValue");
    });

    it("should create InvalidArgumentError with valid values", () => {
      const error = new InvalidArgumentError("direction", "INVALID", [
        "NORTH",
        "SOUTH",
        "EAST",
        "WEST",
      ]);
      expect(error.message).toBe(
        "Invalid direction: INVALID. Valid values are: NORTH, SOUTH, EAST, WEST"
      );
    });

    it("should export ErrorName type", () => {
      // Test that ErrorName type can be used
      const errorName: ErrorName = "InvalidArgumentError";
      expect(errorName).toBe("InvalidArgumentError");
    });
  });
});
