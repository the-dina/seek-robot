import { Direction } from "src/domain/Direction";
import { RotateRightOperation } from "src/domain/direction/operations/RotateRightOperation";
import { describe, expect, it } from "vitest";

describe("RotateRightOperation", () => {
  let operation: RotateRightOperation;

  beforeEach(() => {
    operation = new RotateRightOperation();
  });

  it("should implement IDirectionOperation interface", () => {
    expect(typeof operation.execute).toBe("function");
  });

  it("should rotate NORTH to EAST", () => {
    const result = operation.execute(Direction.NORTH);
    expect(result).toBe(Direction.EAST);
  });

  it("should rotate EAST to SOUTH", () => {
    const result = operation.execute(Direction.EAST);
    expect(result).toBe(Direction.SOUTH);
  });

  it("should rotate SOUTH to WEST", () => {
    const result = operation.execute(Direction.SOUTH);
    expect(result).toBe(Direction.WEST);
  });

  it("should rotate WEST to NORTH", () => {
    const result = operation.execute(Direction.WEST);
    expect(result).toBe(Direction.NORTH);
  });

  it("should complete a full rotation cycle", () => {
    let current = Direction.NORTH;

    current = operation.execute(current); // EAST
    current = operation.execute(current); // SOUTH
    current = operation.execute(current); // WEST
    current = operation.execute(current); // NORTH

    expect(current).toBe(Direction.NORTH);
  });
});
