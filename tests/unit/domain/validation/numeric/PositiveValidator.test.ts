import { PositiveValidator } from "src/domain/validation/numeric/PositiveValidator";
import { describe, expect, it } from "vitest";

describe("PositiveValidator", () => {
  let validator: PositiveValidator;

  beforeEach(() => {
    validator = new PositiveValidator();
  });

  it("should implement IPositiveValidator interface", () => {
    expect(typeof validator.validatePositive).toBe("function");
  });

  it("should not throw error for positive values", () => {
    expect(() => validator.validatePositive(1, "value")).not.toThrow();
    expect(() => validator.validatePositive(100, "value")).not.toThrow();
    expect(() => validator.validatePositive(0.1, "value")).not.toThrow();
    expect(() => validator.validatePositive(1.5, "value")).not.toThrow();
  });

  it("should throw error for zero", () => {
    expect(() => validator.validatePositive(0, "zero")).toThrow();
    expect(() => validator.validatePositive(0.0, "exact zero")).toThrow();
  });

  it("should throw error for negative values", () => {
    expect(() => validator.validatePositive(-1, "negative")).toThrow();
    expect(() => validator.validatePositive(-0.1, "decimal")).toThrow();
  });

  it("should use correct comparison for validation", () => {
    // Test boundary cases
    expect(() =>
      validator.validatePositive(0.0001, "small positive")
    ).not.toThrow();
    expect(() =>
      validator.validatePositive(-0.0001, "small negative")
    ).toThrow();
  });

  it("should handle edge cases correctly", () => {
    expect(() =>
      validator.validatePositive(Number.MAX_VALUE, "max")
    ).not.toThrow();
    expect(() =>
      validator.validatePositive(Number.MIN_VALUE, "min positive")
    ).not.toThrow();
    expect(() =>
      validator.validatePositive(-Number.MAX_VALUE, "negative max")
    ).toThrow();
  });
});
