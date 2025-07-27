import { Table } from "src/domain/Table";
import { TableBoundsCoordinateValidator } from "src/domain/validation/table/TableBoundsCoordinateValidator";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/Table");

describe("TableBoundsCoordinateValidator", () => {
  let mockTable: Table;
  let validator: TableBoundsCoordinateValidator;

  beforeEach(() => {
    mockTable = {
      width: 5,
      height: 5,
    } as Table;
    validator = new TableBoundsCoordinateValidator(mockTable);
  });

  it("should implement ITableBoundsCoordinateValidator interface", () => {
    expect(typeof validator.isValidCoordinates).toBe("function");
  });

  it("should store table reference from constructor", () => {
    // Access private field through any cast for testing
    const validatorAny = validator as any;
    expect(validatorAny.table).toBe(mockTable);
  });

  it("should return true for valid coordinates within bounds", () => {
    expect(validator.isValidCoordinates(0, 0)).toBe(true);
    expect(validator.isValidCoordinates(2, 3)).toBe(true);
    expect(validator.isValidCoordinates(4, 4)).toBe(true);
  });

  it("should return true for coordinates at the bottom-left corner", () => {
    expect(validator.isValidCoordinates(0, 0)).toBe(true);
  });

  it("should return true for coordinates at the top-right corner (within bounds)", () => {
    expect(validator.isValidCoordinates(4, 4)).toBe(true);
  });

  it("should return false for negative x coordinate", () => {
    expect(validator.isValidCoordinates(-1, 2)).toBe(false);
  });

  it("should return false for negative y coordinate", () => {
    expect(validator.isValidCoordinates(2, -1)).toBe(false);
  });

  it("should return false for x coordinate equal to width", () => {
    expect(validator.isValidCoordinates(5, 2)).toBe(false);
  });

  it("should return false for y coordinate equal to height", () => {
    expect(validator.isValidCoordinates(2, 5)).toBe(false);
  });

  it("should return false for x coordinate greater than width", () => {
    expect(validator.isValidCoordinates(6, 2)).toBe(false);
  });

  it("should return false for y coordinate greater than height", () => {
    expect(validator.isValidCoordinates(2, 6)).toBe(false);
  });

  it("should return false when both coordinates are out of bounds", () => {
    expect(validator.isValidCoordinates(-1, -1)).toBe(false);
    expect(validator.isValidCoordinates(10, 10)).toBe(false);
  });

  it("should work with different table dimensions", () => {
    const smallTable = { width: 2, height: 3 } as Table;
    const smallValidator = new TableBoundsCoordinateValidator(smallTable);

    expect(smallValidator.isValidCoordinates(1, 2)).toBe(true);
    expect(smallValidator.isValidCoordinates(2, 2)).toBe(false);
    expect(smallValidator.isValidCoordinates(1, 3)).toBe(false);
  });
});
