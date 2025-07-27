import { type IIntegerValidator } from "src/domain/validation/numeric/IntegerValidator";
import { type IPositiveValidator } from "src/domain/validation/numeric/PositiveValidator";

export interface IDimensionValidator {
  validateDimension(value: number, dimensionName: string): void;
}

export class DimensionValidator implements IDimensionValidator {
  constructor(
    private readonly integerValidator: IIntegerValidator,
    private readonly positiveValidator: IPositiveValidator
  ) {}

  validateDimension(value: number, dimensionName: string): void {
    this.integerValidator.validateInteger(value, dimensionName);
    this.positiveValidator.validatePositive(value, dimensionName);
  }
}
