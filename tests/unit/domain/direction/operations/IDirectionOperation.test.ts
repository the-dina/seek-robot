import { Direction } from "src/domain/Direction";
import { IDirectionOperation } from "src/domain/direction/operations/IDirectionOperation";
import { describe, expect, it } from "vitest";

describe("IDirectionOperation", () => {
  it("should define execute method signature", () => {
    // Create a mock implementation to test the interface
    const mockOperation: IDirectionOperation = {
      execute: (direction: Direction) => direction,
    };

    expect(typeof mockOperation.execute).toBe("function");
    expect(mockOperation.execute(Direction.NORTH)).toBe(Direction.NORTH);
  });

  it("should accept Direction and return Direction", () => {
    const mockOperation: IDirectionOperation = {
      execute: (direction: Direction) => Direction.SOUTH,
    };

    const result = mockOperation.execute(Direction.EAST);

    expect(Object.values(Direction)).toContain(result);
  });
});
