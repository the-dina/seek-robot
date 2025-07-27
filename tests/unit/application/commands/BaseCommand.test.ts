import {
  BaseCommand,
  CommandExecutor,
} from "src/application/commands/BaseCommand";
import { Robot } from "src/domain/Robot";
import { describe, expect, it, vi } from "vitest";

describe("BaseCommand", () => {
  describe("execute", () => {
    it("should return error when robot is not placed and placement is required", () => {
      const mockRobot = { isPlaced: false } as Robot;
      const mockExecutor: CommandExecutor = vi.fn();

      const result = BaseCommand.execute(
        mockRobot,
        mockExecutor,
        "Test error message",
        true
      );

      expect(result).toEqual({
        success: false,
        error: "Robot is not placed on the table",
      });
      expect(mockExecutor).not.toHaveBeenCalled();
    });

    it("should execute when robot is not placed but placement is not required", () => {
      const mockRobot = { isPlaced: false } as Robot;
      const mockExecutor: CommandExecutor = vi.fn().mockReturnValue({
        success: true,
        output: "Success output",
      });

      const result = BaseCommand.execute(
        mockRobot,
        mockExecutor,
        "Test error message",
        false
      );

      expect(result).toEqual({
        success: true,
        output: "Success output",
      });
      expect(mockExecutor).toHaveBeenCalledWith(mockRobot);
    });

    it("should execute when robot is placed", () => {
      const mockRobot = { isPlaced: true } as Robot;
      const mockExecutor: CommandExecutor = vi.fn().mockReturnValue({
        success: true,
        output: "Success output",
      });

      const result = BaseCommand.execute(
        mockRobot,
        mockExecutor,
        "Test error message"
      );

      expect(result).toEqual({
        success: true,
        output: "Success output",
      });
      expect(mockExecutor).toHaveBeenCalledWith(mockRobot);
    });

    it("should return success result without output when executor succeeds without output", () => {
      const mockRobot = { isPlaced: true } as Robot;
      const mockExecutor: CommandExecutor = vi.fn().mockReturnValue({
        success: true,
      });

      const result = BaseCommand.execute(
        mockRobot,
        mockExecutor,
        "Test error message"
      );

      expect(result).toEqual({
        success: true,
      });
      expect(mockExecutor).toHaveBeenCalledWith(mockRobot);
    });

    it("should return error result when executor fails", () => {
      const mockRobot = { isPlaced: true } as Robot;
      const mockExecutor: CommandExecutor = vi.fn().mockReturnValue({
        success: false,
      });

      const result = BaseCommand.execute(
        mockRobot,
        mockExecutor,
        "Test error message"
      );

      expect(result).toEqual({
        success: false,
        error: "Test error message",
      });
      expect(mockExecutor).toHaveBeenCalledWith(mockRobot);
    });

    it("should default requiresPlacement to true when not specified", () => {
      const mockRobot = { isPlaced: false } as Robot;
      const mockExecutor: CommandExecutor = vi.fn();

      const result = BaseCommand.execute(
        mockRobot,
        mockExecutor,
        "Test error message"
      );

      expect(result).toEqual({
        success: false,
        error: "Robot is not placed on the table",
      });
      expect(mockExecutor).not.toHaveBeenCalled();
    });
  });
});
