import { InvalidArgumentError } from "src/types/errors";

export interface IPositiveValidator {
  validatePositive(value: number, fieldName: string): void;
}

export class PositiveValidator implements IPositiveValidator {
  validatePositive(value: number, fieldName: string): void {
    if (value <= 0) {
      throw new InvalidArgumentError(fieldName, value, ["positive values"]);
    }
  }
}
