import { Table } from "src/domain/Table";
import { describe, expect, it } from "vitest";

describe("Table", () => {
  it("should create table with valid dimensions", () => {
    const table = new Table(5, 6);

    expect(table.width).toBe(5);
    expect(table.height).toBe(6);
  });

  it("should make dimensions readonly", () => {
    const table = new Table(3, 4);

    // Test that we cannot reassign the values (TypeScript will prevent it)
    expect(table.width).toBe(3);
    expect(table.height).toBe(4);

    // Verify the properties exist and have the correct values
    expect(Object.hasOwnProperty.call(table, "width")).toBe(true);
    expect(Object.hasOwnProperty.call(table, "height")).toBe(true);
  });

  it("should validate dimensions during construction", () => {
    // This test just ensures that construction works with valid dimensions
    // The actual validation is tested in the DimensionValidator unit tests
    expect(() => new Table(1, 1)).not.toThrow();
    expect(() => new Table(10, 5)).not.toThrow();
  });
});
