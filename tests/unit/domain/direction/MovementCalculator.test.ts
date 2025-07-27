import { Direction } from "src/domain/Direction";
import { MovementCalculator } from "src/domain/direction/MovementCalculator";
import { Position } from "src/domain/Position";
import { describe, expect, it, vi } from "vitest";

// Mock Position
vi.mock("src/domain/Position");

describe("MovementCalculator", () => {
  let mockPosition: Position;

  beforeEach(() => {
    mockPosition = { x: 2, y: 3 } as Position;
  });

  it("should calculate next coordinates for NORTH direction", () => {
    const result = MovementCalculator.calculateNextCoordinates(
      mockPosition,
      Direction.NORTH
    );

    expect(result).toEqual({ x: 2, y: 4 });
  });

  it("should calculate next coordinates for SOUTH direction", () => {
    const result = MovementCalculator.calculateNextCoordinates(
      mockPosition,
      Direction.SOUTH
    );

    expect(result).toEqual({ x: 2, y: 2 });
  });

  it("should calculate next coordinates for EAST direction", () => {
    const result = MovementCalculator.calculateNextCoordinates(
      mockPosition,
      Direction.EAST
    );

    expect(result).toEqual({ x: 3, y: 3 });
  });

  it("should calculate next coordinates for WEST direction", () => {
    const result = MovementCalculator.calculateNextCoordinates(
      mockPosition,
      Direction.WEST
    );

    expect(result).toEqual({ x: 1, y: 3 });
  });

  it("should throw error for unknown direction", () => {
    const invalidDirection = "INVALID" as Direction;

    expect(() =>
      MovementCalculator.calculateNextCoordinates(
        mockPosition,
        invalidDirection
      )
    ).toThrow("Unknown direction: INVALID");
  });

  it("should return object with x and y properties", () => {
    const result = MovementCalculator.calculateNextCoordinates(
      mockPosition,
      Direction.NORTH
    );

    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("y");
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
  });
});
