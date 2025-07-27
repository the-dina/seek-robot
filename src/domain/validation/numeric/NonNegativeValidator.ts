import { InvalidArgumentError } from "src/types/errors";

export interface INonNegativeValidator {
  validateNonNegative(value: number, fieldName: string): void;
}

export class NonNegativeValidator implements INonNegativeValidator {
  validateNonNegative(value: number, fieldName: string): void {
    if (value < 0) {
      throw new InvalidArgumentError(fieldName, value, ["non-negative values"]);
    }
  }
}
