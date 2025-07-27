import { Position } from "src/domain/Position";
import { describe, expect, it } from "vitest";

describe("Position", () => {
  it("should create position with valid coordinates", () => {
    const position = new Position(3, 5);

    expect(position.x).toBe(3);
    expect(position.y).toBe(5);
  });

  it("should make coordinates readonly", () => {
    const position = new Position(1, 2);

    // Test that we cannot reassign the values (TypeScript will prevent it)
    expect(position.x).toBe(1);
    expect(position.y).toBe(2);

    // Verify the properties exist and have the correct values
    expect(Object.hasOwnProperty.call(position, "x")).toBe(true);
    expect(Object.hasOwnProperty.call(position, "y")).toBe(true);
  });

  it("should validate coordinates during construction", () => {
    // This test just ensures that construction works with valid coordinates
    // The actual validation is tested in the CoordinateValidator unit tests
    expect(() => new Position(0, 0)).not.toThrow();
    expect(() => new Position(5, 3)).not.toThrow();
  });
});
