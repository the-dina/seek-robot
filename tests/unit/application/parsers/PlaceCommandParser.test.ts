import { PlaceCommand } from "src/application/commands/PlaceCommand";
import { PlaceCommandParser } from "src/application/parsers/PlaceCommandParser";
import { describe, expect, it } from "vitest";

describe("PlaceCommandParser", () => {
  const parser = new PlaceCommandParser();

  it("should parse valid PLACE command with NORTH direction", () => {
    const result = parser.parse("PLACE 1,2,NORTH");

    expect(result).toBeInstanceOf(PlaceCommand);
    expect(result).not.toBeNull();
  });

  it("should parse valid PLACE command with SOUTH direction", () => {
    const result = parser.parse("PLACE 0,0,SOUTH");

    expect(result).toBeInstanceOf(PlaceCommand);
    expect(result).not.toBeNull();
  });

  it("should parse valid PLACE command with EAST direction", () => {
    const result = parser.parse("PLACE 3,4,EAST");

    expect(result).toBeInstanceOf(PlaceCommand);
    expect(result).not.toBeNull();
  });

  it("should parse valid PLACE command with WEST direction", () => {
    const result = parser.parse("PLACE 5,1,WEST");

    expect(result).toBeInstanceOf(PlaceCommand);
    expect(result).not.toBeNull();
  });

  it("should return null for invalid command format", () => {
    const result = parser.parse("PLACE 1,2");

    expect(result).toBeNull();
  });

  it("should return null for invalid direction", () => {
    const result = parser.parse("PLACE 1,2,INVALID");

    expect(result).toBeNull();
  });

  it("should return null for non-numeric coordinates", () => {
    const result = parser.parse("PLACE a,b,NORTH");

    expect(result).toBeNull();
  });

  it("should return null for command with extra spaces", () => {
    const result = parser.parse("PLACE  1, 2, NORTH");

    expect(result).toBeNull();
  });

  it("should return null for completely invalid command", () => {
    const result = parser.parse("INVALID COMMAND");

    expect(result).toBeNull();
  });

  it("should return null for empty command", () => {
    const result = parser.parse("");

    expect(result).toBeNull();
  });
});
