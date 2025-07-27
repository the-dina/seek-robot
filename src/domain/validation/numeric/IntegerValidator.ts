import { InvalidArgumentError } from "src/types/errors";

export interface IIntegerValidator {
  validateInteger(value: number, fieldName: string): void;
}

export class IntegerValidator implements IIntegerValidator {
  validateInteger(value: number, fieldName: string): void {
    if (!Number.isInteger(value)) {
      throw new InvalidArgumentError(fieldName, value, ["integers"]);
    }
  }
}
