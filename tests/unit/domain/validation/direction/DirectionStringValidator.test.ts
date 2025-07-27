import { Direction } from "src/domain/Direction";
import { DirectionStringValidator } from "src/domain/validation/direction/DirectionStringValidator";
import { describe, expect, it } from "vitest";

describe("DirectionStringValidator", () => {
  let validator: DirectionStringValidator;

  beforeEach(() => {
    validator = new DirectionStringValidator();
  });

  it("should implement IDirectionStringValidator interface", () => {
    expect(typeof validator.validateDirectionString).toBe("function");
    expect(typeof validator.isValidDirectionString).toBe("function");
  });

  it("should return true for valid direction strings", () => {
    expect(validator.isValidDirectionString("NORTH")).toBe(true);
    expect(validator.isValidDirectionString("SOUTH")).toBe(true);
    expect(validator.isValidDirectionString("EAST")).toBe(true);
    expect(validator.isValidDirectionString("WEST")).toBe(true);
  });

  it("should return false for invalid direction strings", () => {
    expect(validator.isValidDirectionString("INVALID")).toBe(false);
    expect(validator.isValidDirectionString("north")).toBe(false);
    expect(validator.isValidDirectionString("")).toBe(false);
    expect(validator.isValidDirectionString("UP")).toBe(false);
  });

  it("should not throw error for valid direction strings", () => {
    expect(() =>
      validator.validateDirectionString("NORTH", "direction")
    ).not.toThrow();
    expect(() =>
      validator.validateDirectionString("SOUTH", "direction")
    ).not.toThrow();
    expect(() =>
      validator.validateDirectionString("EAST", "direction")
    ).not.toThrow();
    expect(() =>
      validator.validateDirectionString("WEST", "direction")
    ).not.toThrow();
  });

  it("should throw error for invalid direction strings", () => {
    expect(() =>
      validator.validateDirectionString("INVALID", "direction")
    ).toThrow();
    expect(() =>
      validator.validateDirectionString("north", "direction")
    ).toThrow();
    expect(() => validator.validateDirectionString("", "direction")).toThrow();
  });

  it("should use all Direction enum values in validation", () => {
    const directionValues = Object.values(Direction);

    directionValues.forEach((direction) => {
      expect(validator.isValidDirectionString(direction)).toBe(true);
    });
  });

  it("should initialize with correct valid directions set", () => {
    // Test that constructor properly sets up the valid directions
    const allDirections = Object.values(Direction);

    allDirections.forEach((direction) => {
      expect(validator.isValidDirectionString(direction)).toBe(true);
    });

    expect(allDirections).toHaveLength(4);
  });
});
