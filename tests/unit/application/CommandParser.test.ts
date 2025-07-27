import { CommandParser } from "src/application/CommandParser";
import { LeftCommand } from "src/application/commands/LeftCommand";
import { MoveCommand } from "src/application/commands/MoveCommand";
import { PlaceCommand } from "src/application/commands/PlaceCommand";
import { ReportCommand } from "src/application/commands/ReportCommand";
import { RightCommand } from "src/application/commands/RightCommand";
import { PlaceCommandParser } from "src/application/parsers/PlaceCommandParser";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("src/application/parsers/PlaceCommandParser");

describe("CommandParser", () => {
  let commandParser: CommandParser;
  let mockPlaceCommandParser: any;

  beforeEach(() => {
    mockPlaceCommandParser = {
      parse: vi.fn(),
    };

    vi.mocked(PlaceCommandParser).mockImplementation(
      () => mockPlaceCommandParser
    );
    commandParser = new CommandParser();
  });

  describe("parseCommand", () => {
    it("should return null for empty command", () => {
      const result = commandParser.parseCommand("");
      expect(result).toBeNull();
    });

    it("should return null for whitespace-only command", () => {
      const result = commandParser.parseCommand("   ");
      expect(result).toBeNull();
    });

    it("should return MoveCommand for MOVE command", () => {
      const result = commandParser.parseCommand("MOVE");
      expect(result).toBeInstanceOf(MoveCommand);
    });

    it("should return MoveCommand for lowercase move command", () => {
      const result = commandParser.parseCommand("move");
      expect(result).toBeInstanceOf(MoveCommand);
    });

    it("should return LeftCommand for LEFT command", () => {
      const result = commandParser.parseCommand("LEFT");
      expect(result).toBeInstanceOf(LeftCommand);
    });

    it("should return RightCommand for RIGHT command", () => {
      const result = commandParser.parseCommand("RIGHT");
      expect(result).toBeInstanceOf(RightCommand);
    });

    it("should return ReportCommand for REPORT command", () => {
      const result = commandParser.parseCommand("REPORT");
      expect(result).toBeInstanceOf(ReportCommand);
    });

    it("should handle commands with extra whitespace", () => {
      const result = commandParser.parseCommand("  MOVE  ");
      expect(result).toBeInstanceOf(MoveCommand);
    });

    it("should delegate PLACE command parsing to PlaceCommandParser", () => {
      const mockPlaceCommand = {} as PlaceCommand;
      mockPlaceCommandParser.parse.mockReturnValue(mockPlaceCommand);

      const result = commandParser.parseCommand("PLACE 1,2,NORTH");

      expect(mockPlaceCommandParser.parse).toHaveBeenCalledWith(
        "PLACE 1,2,NORTH"
      );
      expect(result).toBe(mockPlaceCommand);
    });

    it("should return null for invalid command", () => {
      const result = commandParser.parseCommand("INVALID");
      expect(result).toBeNull();
    });

    it("should return null when PlaceCommandParser returns null", () => {
      mockPlaceCommandParser.parse.mockReturnValue(null);

      const result = commandParser.parseCommand("PLACE invalid");
      expect(result).toBeNull();
    });
  });

  describe("isValidCommand", () => {
    it("should return true for valid commands", () => {
      expect(commandParser.isValidCommand("MOVE")).toBe(true);
      expect(commandParser.isValidCommand("LEFT")).toBe(true);
      expect(commandParser.isValidCommand("RIGHT")).toBe(true);
      expect(commandParser.isValidCommand("REPORT")).toBe(true);
    });

    it("should return true for valid PLACE command", () => {
      const mockPlaceCommand = {} as PlaceCommand;
      mockPlaceCommandParser.parse.mockReturnValue(mockPlaceCommand);

      expect(commandParser.isValidCommand("PLACE 1,2,NORTH")).toBe(true);
    });

    it("should return false for invalid commands", () => {
      expect(commandParser.isValidCommand("INVALID")).toBe(false);
      expect(commandParser.isValidCommand("")).toBe(false);
      expect(commandParser.isValidCommand("   ")).toBe(false);
    });

    it("should return false for invalid PLACE command", () => {
      mockPlaceCommandParser.parse.mockReturnValue(null);

      expect(commandParser.isValidCommand("PLACE invalid")).toBe(false);
    });
  });
});
