import { CommandParser } from "src/application/CommandParser";
import { CommandProcessor } from "src/application/CommandProcessor";
import { PlaceCommand } from "src/application/commands/PlaceCommand";
import { ReportCommand } from "src/application/commands/ReportCommand";
import { Robot } from "src/domain/Robot";
import { IOutputWriter } from "src/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("src/application/CommandParser");

describe("CommandProcessor", () => {
  let commandProcessor: CommandProcessor;
  let mockRobot: Robot;
  let mockOutputWriter: IOutputWriter;
  let mockCommandParser: any;

  beforeEach(() => {
    mockRobot = {} as Robot;
    mockOutputWriter = {
      write: vi.fn(),
      writeError: vi.fn(),
      writeSuccess: vi.fn(),
      writeInfo: vi.fn(),
      writeWarning: vi.fn(),
      writeCommand: vi.fn(),
      writeReport: vi.fn(),
    };

    mockCommandParser = {
      parseCommand: vi.fn(),
    };

    vi.mocked(CommandParser).mockImplementation(() => mockCommandParser);
    commandProcessor = new CommandProcessor(mockRobot, mockOutputWriter);
  });

  describe("processCommand", () => {
    it("should return invalid command result when parser returns null", () => {
      mockCommandParser.parseCommand.mockReturnValue(null);

      const result = commandProcessor.processCommand("INVALID");

      expect(result).toEqual({
        success: false,
        error: "Invalid command: INVALID",
      });
    });

    it("should execute PlaceCommand even when robot is not placed", () => {
      const mockPlaceCommand = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;
      Object.setPrototypeOf(mockPlaceCommand, PlaceCommand.prototype);

      mockCommandParser.parseCommand.mockReturnValue(mockPlaceCommand);

      const result = commandProcessor.processCommand("PLACE 1,2,NORTH");

      expect(mockPlaceCommand.execute).toHaveBeenCalledWith(mockRobot);
      expect(result).toEqual({ success: true });
    });

    it("should not execute non-PLACE commands when robot is not placed", () => {
      const mockMoveCommand = {
        execute: vi.fn(),
      } as any;

      mockCommandParser.parseCommand.mockReturnValue(mockMoveCommand);

      const result = commandProcessor.processCommand("MOVE");

      expect(mockMoveCommand.execute).not.toHaveBeenCalled();
      expect(mockOutputWriter.writeWarning).toHaveBeenCalledWith(
        "Command ignored: Robot must be placed on the table before executing other commands"
      );
      expect(result).toEqual({ success: true });
    });

    it("should execute commands after successful PLACE command", () => {
      // First place the robot
      const mockPlaceCommand = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;
      Object.setPrototypeOf(mockPlaceCommand, PlaceCommand.prototype);

      mockCommandParser.parseCommand.mockReturnValue(mockPlaceCommand);
      commandProcessor.processCommand("PLACE 1,2,NORTH");

      // Then execute a move command
      const mockMoveCommand = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;

      mockCommandParser.parseCommand.mockReturnValue(mockMoveCommand);
      const result = commandProcessor.processCommand("MOVE");

      expect(mockMoveCommand.execute).toHaveBeenCalledWith(mockRobot);
      expect(result).toEqual({ success: true });
    });

    it("should write report output for ReportCommand", () => {
      // Place robot first
      const mockPlaceCommand = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;
      Object.setPrototypeOf(mockPlaceCommand, PlaceCommand.prototype);

      mockCommandParser.parseCommand.mockReturnValue(mockPlaceCommand);
      commandProcessor.processCommand("PLACE 1,2,NORTH");

      // Execute report command
      const mockReportCommand = {
        execute: vi
          .fn()
          .mockReturnValue({ success: true, output: "1,2,NORTH" }),
      } as any;
      Object.setPrototypeOf(mockReportCommand, ReportCommand.prototype);

      mockCommandParser.parseCommand.mockReturnValue(mockReportCommand);
      commandProcessor.processCommand("REPORT");

      expect(mockOutputWriter.writeReport).toHaveBeenCalledWith("1,2,NORTH");
    });

    it("should write regular output for non-ReportCommand with output", () => {
      // Place robot first
      const mockPlaceCommand = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;
      Object.setPrototypeOf(mockPlaceCommand, PlaceCommand.prototype);

      mockCommandParser.parseCommand.mockReturnValue(mockPlaceCommand);
      commandProcessor.processCommand("PLACE 1,2,NORTH");

      // Execute command with output
      const mockCommand = {
        execute: vi
          .fn()
          .mockReturnValue({ success: true, output: "some output" }),
      } as any;

      mockCommandParser.parseCommand.mockReturnValue(mockCommand);
      commandProcessor.processCommand("SOME_COMMAND");

      expect(mockOutputWriter.write).toHaveBeenCalledWith("some output");
    });

    it("should not set placement state when PLACE command fails", () => {
      const mockPlaceCommand = {
        execute: vi
          .fn()
          .mockReturnValue({ success: false, error: "Invalid position" }),
      } as any;
      Object.setPrototypeOf(mockPlaceCommand, PlaceCommand.prototype);

      mockCommandParser.parseCommand.mockReturnValue(mockPlaceCommand);
      commandProcessor.processCommand("PLACE 10,10,NORTH");

      // Try to execute another command
      const mockMoveCommand = {
        execute: vi.fn(),
      } as any;

      mockCommandParser.parseCommand.mockReturnValue(mockMoveCommand);
      commandProcessor.processCommand("MOVE");

      expect(mockMoveCommand.execute).not.toHaveBeenCalled();
      expect(mockOutputWriter.writeWarning).toHaveBeenCalledWith(
        "Command ignored: Robot must be placed on the table before executing other commands"
      );
    });
  });

  describe("processCommands", () => {
    it("should process multiple commands and return results", () => {
      // Place robot first to allow commands to execute
      const mockPlaceCommand = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;
      Object.setPrototypeOf(mockPlaceCommand, PlaceCommand.prototype);

      const mockCommand1 = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;
      const mockCommand2 = {
        execute: vi.fn().mockReturnValue({ success: false, error: "Error" }),
      } as any;

      mockCommandParser.parseCommand
        .mockReturnValueOnce(mockPlaceCommand) // Place first
        .mockReturnValueOnce(mockCommand1)
        .mockReturnValueOnce(mockCommand2);

      const results = commandProcessor.processCommands([
        "PLACE 1,2,NORTH",
        "CMD1",
        "CMD2",
      ]);

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({ success: true });
      expect(results[1]).toEqual({ success: true });
      expect(results[2]).toEqual({ success: false, error: "Error" });
    });
  });

  describe("reset", () => {
    it("should reset placement state", () => {
      // Place robot first
      const mockPlaceCommand = {
        execute: vi.fn().mockReturnValue({ success: true }),
      } as any;
      Object.setPrototypeOf(mockPlaceCommand, PlaceCommand.prototype);

      mockCommandParser.parseCommand.mockReturnValue(mockPlaceCommand);
      commandProcessor.processCommand("PLACE 1,2,NORTH");

      // Reset
      commandProcessor.reset();

      // Try to execute a command after reset
      const mockMoveCommand = {
        execute: vi.fn(),
      } as any;

      mockCommandParser.parseCommand.mockReturnValue(mockMoveCommand);
      commandProcessor.processCommand("MOVE");

      expect(mockMoveCommand.execute).not.toHaveBeenCalled();
      expect(mockOutputWriter.writeWarning).toHaveBeenCalledWith(
        "Command ignored: Robot must be placed on the table before executing other commands"
      );
    });
  });
});
