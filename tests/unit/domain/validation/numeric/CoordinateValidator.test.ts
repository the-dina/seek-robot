import { CoordinateValidator } from "src/domain/validation/numeric/CoordinateValidator";
import { IIntegerValidator } from "src/domain/validation/numeric/IntegerValidator";
import { INonNegativeValidator } from "src/domain/validation/numeric/NonNegativeValidator";
import { describe, expect, it, vi } from "vitest";

describe("CoordinateValidator", () => {
  let mockIntegerValidator: IIntegerValidator;
  let mockNonNegativeValidator: INonNegativeValidator;
  let coordinateValidator: CoordinateValidator;

  beforeEach(() => {
    mockIntegerValidator = {
      validateInteger: vi.fn(),
    };
    mockNonNegativeValidator = {
      validateNonNegative: vi.fn(),
    };
    coordinateValidator = new CoordinateValidator(
      mockIntegerValidator,
      mockNonNegativeValidator
    );
  });

  it("should implement ICoordinateValidator interface", () => {
    expect(typeof coordinateValidator.validateCoordinate).toBe("function");
  });

  it("should call integer validator with correct parameters", () => {
    coordinateValidator.validateCoordinate(5, "x coordinate");

    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(
      5,
      "x coordinate"
    );
  });

  it("should call non-negative validator with correct parameters", () => {
    coordinateValidator.validateCoordinate(3, "y coordinate");

    expect(mockNonNegativeValidator.validateNonNegative).toHaveBeenCalledWith(
      3,
      "y coordinate"
    );
  });

  it("should call both validators for a single coordinate", () => {
    coordinateValidator.validateCoordinate(7, "coordinate");

    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(
      7,
      "coordinate"
    );
    expect(mockNonNegativeValidator.validateNonNegative).toHaveBeenCalledWith(
      7,
      "coordinate"
    );
  });

  it("should call validators in correct order", () => {
    const callOrder: string[] = [];

    mockIntegerValidator.validateInteger = vi.fn(() =>
      callOrder.push("integer")
    );
    mockNonNegativeValidator.validateNonNegative = vi.fn(() =>
      callOrder.push("nonNegative")
    );

    coordinateValidator.validateCoordinate(2, "test");

    expect(callOrder).toEqual(["integer", "nonNegative"]);
  });

  it("should pass through any validation errors from integer validator", () => {
    const error = new Error("Integer validation failed");
    mockIntegerValidator.validateInteger = vi.fn(() => {
      throw error;
    });

    expect(() =>
      coordinateValidator.validateCoordinate(1.5, "decimal")
    ).toThrow(error);
  });

  it("should pass through any validation errors from non-negative validator", () => {
    const error = new Error("Non-negative validation failed");
    mockNonNegativeValidator.validateNonNegative = vi.fn(() => {
      throw error;
    });

    expect(() =>
      coordinateValidator.validateCoordinate(-1, "negative")
    ).toThrow(error);
  });

  it("should validate different coordinate names correctly", () => {
    coordinateValidator.validateCoordinate(0, "x");
    coordinateValidator.validateCoordinate(4, "y");

    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(0, "x");
    expect(mockIntegerValidator.validateInteger).toHaveBeenCalledWith(4, "y");
    expect(mockNonNegativeValidator.validateNonNegative).toHaveBeenCalledWith(
      0,
      "x"
    );
    expect(mockNonNegativeValidator.validateNonNegative).toHaveBeenCalledWith(
      4,
      "y"
    );
  });
});
