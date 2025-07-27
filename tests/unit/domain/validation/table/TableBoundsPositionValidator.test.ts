import { Position } from "src/domain/Position";
import { Table } from "src/domain/Table";
import { TableBoundsPositionValidator } from "src/domain/validation/table/TableBoundsPositionValidator";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/Table");
vi.mock("src/domain/Position");

describe("TableBoundsPositionValidator", () => {
  let mockTable: Table;
  let validator: TableBoundsPositionValidator;

  beforeEach(() => {
    mockTable = {
      width: 5,
      height: 5,
    } as Table;
    validator = new TableBoundsPositionValidator(mockTable);
  });

  it("should implement ITableBoundsPositionValidator interface", () => {
    expect(typeof validator.isValidPosition).toBe("function");
  });

  it("should store table reference from constructor", () => {
    // Access private field through any cast for testing
    const validatorAny = validator as any;
    expect(validatorAny.table).toBe(mockTable);
  });

  it("should return true for valid position within bounds", () => {
    const position = { x: 2, y: 3 } as Position;
    expect(validator.isValidPosition(position)).toBe(true);
  });

  it("should return true for position at bottom-left corner", () => {
    const position = { x: 0, y: 0 } as Position;
    expect(validator.isValidPosition(position)).toBe(true);
  });

  it("should return true for position at top-right corner (within bounds)", () => {
    const position = { x: 4, y: 4 } as Position;
    expect(validator.isValidPosition(position)).toBe(true);
  });

  it("should return false for position with negative x coordinate", () => {
    const position = { x: -1, y: 2 } as Position;
    expect(validator.isValidPosition(position)).toBe(false);
  });

  it("should return false for position with negative y coordinate", () => {
    const position = { x: 2, y: -1 } as Position;
    expect(validator.isValidPosition(position)).toBe(false);
  });

  it("should return false for position with x coordinate equal to width", () => {
    const position = { x: 5, y: 2 } as Position;
    expect(validator.isValidPosition(position)).toBe(false);
  });

  it("should return false for position with y coordinate equal to height", () => {
    const position = { x: 2, y: 5 } as Position;
    expect(validator.isValidPosition(position)).toBe(false);
  });

  it("should return false for position with x coordinate greater than width", () => {
    const position = { x: 6, y: 2 } as Position;
    expect(validator.isValidPosition(position)).toBe(false);
  });

  it("should return false for position with y coordinate greater than height", () => {
    const position = { x: 2, y: 6 } as Position;
    expect(validator.isValidPosition(position)).toBe(false);
  });

  it("should return false when both coordinates are out of bounds", () => {
    const position1 = { x: -1, y: -1 } as Position;
    const position2 = { x: 10, y: 10 } as Position;

    expect(validator.isValidPosition(position1)).toBe(false);
    expect(validator.isValidPosition(position2)).toBe(false);
  });

  it("should work with different table dimensions", () => {
    const smallTable = { width: 2, height: 3 } as Table;
    const smallValidator = new TableBoundsPositionValidator(smallTable);

    const validPosition = { x: 1, y: 2 } as Position;
    const invalidPosition1 = { x: 2, y: 2 } as Position;
    const invalidPosition2 = { x: 1, y: 3 } as Position;

    expect(smallValidator.isValidPosition(validPosition)).toBe(true);
    expect(smallValidator.isValidPosition(invalidPosition1)).toBe(false);
    expect(smallValidator.isValidPosition(invalidPosition2)).toBe(false);
  });

  it("should access position properties correctly", () => {
    const position = { x: 3, y: 1 } as Position;

    validator.isValidPosition(position);

    // The function should access position.x and position.y
    // This test verifies the implementation uses the correct properties
    expect(validator.isValidPosition(position)).toBe(true);
  });
});
