import { type IIntegerValidator } from "src/domain/validation/numeric/IntegerValidator";
import { type INonNegativeValidator } from "src/domain/validation/numeric/NonNegativeValidator";

export interface ICoordinateValidator {
  validateCoordinate(value: number, coordinateName: string): void;
}

export class CoordinateValidator implements ICoordinateValidator {
  constructor(
    private readonly integerValidator: IIntegerValidator,
    private readonly nonNegativeValidator: INonNegativeValidator
  ) {}

  validateCoordinate(value: number, coordinateName: string): void {
    this.integerValidator.validateInteger(value, coordinateName);
    this.nonNegativeValidator.validateNonNegative(value, coordinateName);
  }
}
