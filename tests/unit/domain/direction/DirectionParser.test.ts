import { Direction } from "src/domain/Direction";
import { DirectionParser } from "src/domain/direction/DirectionParser";
import { describe, expect, it } from "vitest";

describe("DirectionParser", () => {
  it("should parse valid direction strings to enum values", () => {
    const result = DirectionParser.fromString("north");
    expect(result).toBe(Direction.NORTH);
  });

  it("should handle uppercase input", () => {
    const result = DirectionParser.fromString("SOUTH");
    expect(result).toBe(Direction.SOUTH);
  });

  it("should handle lowercase input", () => {
    const result = DirectionParser.fromString("east");
    expect(result).toBe(Direction.EAST);
  });

  it("should handle mixed case input", () => {
    const result = DirectionParser.fromString("WeSt");
    expect(result).toBe(Direction.WEST);
  });

  it("should convert input to uppercase before processing", () => {
    expect(DirectionParser.fromString("north")).toBe(Direction.NORTH);
    expect(DirectionParser.fromString("NORTH")).toBe(Direction.NORTH);
    expect(DirectionParser.fromString("NoRtH")).toBe(Direction.NORTH);
  });

  it("should validate input during parsing", () => {
    // This test ensures parsing works with valid inputs
    // The actual validation logic is tested in DirectionStringValidator unit tests
    expect(() => DirectionParser.fromString("NORTH")).not.toThrow();
    expect(() => DirectionParser.fromString("south")).not.toThrow();
  });
});
