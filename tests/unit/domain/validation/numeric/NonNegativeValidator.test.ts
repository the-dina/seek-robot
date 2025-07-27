import { NonNegativeValidator } from "src/domain/validation/numeric/NonNegativeValidator";
import { describe, expect, it } from "vitest";

describe("NonNegativeValidator", () => {
  let validator: NonNegativeValidator;

  beforeEach(() => {
    validator = new NonNegativeValidator();
  });

  it("should implement INonNegativeValidator interface", () => {
    expect(typeof validator.validateNonNegative).toBe("function");
  });

  it("should not throw error for non-negative values", () => {
    expect(() => validator.validateNonNegative(0, "value")).not.toThrow();
    expect(() => validator.validateNonNegative(1, "value")).not.toThrow();
    expect(() => validator.validateNonNegative(100, "value")).not.toThrow();
    expect(() => validator.validateNonNegative(1.5, "value")).not.toThrow();
  });

  it("should not throw error for zero", () => {
    expect(() => validator.validateNonNegative(0, "zero")).not.toThrow();
  });

  it("should throw error for negative values", () => {
    expect(() => validator.validateNonNegative(-1, "negative")).toThrow();
    expect(() => validator.validateNonNegative(-0.1, "decimal")).toThrow();
    expect(() => validator.validateNonNegative(-100, "large")).toThrow();
  });

  it("should use correct comparison for validation", () => {
    // Test boundary cases
    expect(() =>
      validator.validateNonNegative(0.0001, "small positive")
    ).not.toThrow();
    expect(() =>
      validator.validateNonNegative(-0.0001, "small negative")
    ).toThrow();
  });

  it("should handle edge cases correctly", () => {
    expect(() =>
      validator.validateNonNegative(0.0, "exact zero")
    ).not.toThrow();
    expect(() =>
      validator.validateNonNegative(Number.MAX_VALUE, "max")
    ).not.toThrow();
    expect(() =>
      validator.validateNonNegative(-Number.MIN_VALUE, "negative min")
    ).toThrow();
  });
});
