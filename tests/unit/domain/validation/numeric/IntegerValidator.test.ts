import { IntegerValidator } from "src/domain/validation/numeric/IntegerValidator";
import { describe, expect, it } from "vitest";

describe("IntegerValidator", () => {
  let validator: IntegerValidator;

  beforeEach(() => {
    validator = new IntegerValidator();
  });

  it("should implement IIntegerValidator interface", () => {
    expect(typeof validator.validateInteger).toBe("function");
  });

  it("should not throw error for valid integers", () => {
    expect(() => validator.validateInteger(0, "value")).not.toThrow();
    expect(() => validator.validateInteger(1, "value")).not.toThrow();
    expect(() => validator.validateInteger(-1, "value")).not.toThrow();
    expect(() => validator.validateInteger(100, "value")).not.toThrow();
  });

  it("should throw error for non-integers", () => {
    expect(() => validator.validateInteger(1.5, "value")).toThrow();
    expect(() => validator.validateInteger(3.14, "pi")).toThrow();
    expect(() => validator.validateInteger(NaN, "invalid")).toThrow();
    expect(() => validator.validateInteger(Infinity, "infinite")).toThrow();
  });

  it("should use Number.isInteger for validation", () => {
    // Test that integers pass validation
    expect(() => validator.validateInteger(5, "test")).not.toThrow();
    expect(() => validator.validateInteger(-10, "test")).not.toThrow();
    expect(() => validator.validateInteger(0, "test")).not.toThrow();

    // Test that non-integers fail validation
    expect(() => validator.validateInteger(5.1, "test")).toThrow();
  });

  it("should validate edge cases correctly", () => {
    expect(() =>
      validator.validateInteger(Number.MAX_SAFE_INTEGER, "max")
    ).not.toThrow();
    expect(() =>
      validator.validateInteger(Number.MIN_SAFE_INTEGER, "min")
    ).not.toThrow();
    expect(() => validator.validateInteger(-0, "negative zero")).not.toThrow();
  });
});
