import { DimensionValidator } from "src/domain/validation/numeric/DimensionValidator";
import { IIntegerValidator } from "src/domain/validation/numeric/IntegerValidator";
import { IPositiveValidator } from "src/domain/validation/numeric/PositiveValidator";
import { describe, expect, it, vi } from "vitest";

describe("DimensionValidator", () => {
  let mockIntegerValidator: IIntegerValidator;
  let mockPositiveValidator: IPositiveValidator;
  let dimensionValidator: DimensionValidator;

  beforeEach(() => {
    mockIntegerValidator = {
      validateInteger: vi.fn(),
    };
    mockPositiveValidator = {
      validatePositive: vi.fn(),
    };
    dimensionValidator = new DimensionValidator(
      mockIntegerValidator,
      mockPositiveValidator
    );
  });

  it("should implement IDimensionValidator interface", () => {
    expect(typeof dimensionValidator.validateDimension).toBe("function");
  });

  it("should call integer validator with correct parameters", () => {
    dimensionValidator.validateDimension(5, "width");

    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(
      5,
      "width"
    );
  });

  it("should call positive validator with correct parameters", () => {
    dimensionValidator.validateDimension(3, "height");

    expect(mockPositiveValidator.validatePositive).toHaveBeenCalledWith(
      3,
      "height"
    );
  });

  it("should call both validators for a single dimension", () => {
    dimensionValidator.validateDimension(7, "dimension");

    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(
      7,
      "dimension"
    );
    expect(mockPositiveValidator.validatePositive).toHaveBeenCalledWith(
      7,
      "dimension"
    );
  });

  it("should call validators in correct order", () => {
    const callOrder: string[] = [];

    mockIntegerValidator.validateInteger = vi.fn(() =>
      callOrder.push("integer")
    );
    mockPositiveValidator.validatePositive = vi.fn(() =>
      callOrder.push("positive")
    );

    dimensionValidator.validateDimension(2, "test");

    expect(callOrder).toEqual(["integer", "positive"]);
  });

  it("should pass through any validation errors from integer validator", () => {
    const error = new Error("Integer validation failed");
    mockIntegerValidator.validateInteger = vi.fn(() => {
      throw error;
    });

    expect(() => dimensionValidator.validateDimension(1.5, "decimal")).toThrow(
      error
    );
  });

  it("should pass through any validation errors from positive validator", () => {
    const error = new Error("Positive validation failed");
    mockPositiveValidator.validatePositive = vi.fn(() => {
      throw error;
    });

    expect(() => dimensionValidator.validateDimension(0, "zero")).toThrow(
      error
    );
  });

  it("should validate different dimension names correctly", () => {
    dimensionValidator.validateDimension(5, "table width");
    dimensionValidator.validateDimension(4, "table height");

    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(
      5,
      "table width"
    );
    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(
      4,
      "table height"
    );
    expect(mockPositiveValidator.validatePositive).toHaveBeenCalledWith(
      5,
      "table width"
    );
    expect(mockPositiveValidator.validatePositive).toHaveBeenCalledWith(
      4,
      "table height"
    );
  });
});
