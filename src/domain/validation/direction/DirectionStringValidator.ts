import { Direction } from "src/domain/Direction";
import { InvalidArgumentError } from "src/types/errors";

export interface IDirectionStringValidator {
  validateDirectionString(value: string, fieldName: string): void;
  isValidDirectionString(value: string): boolean;
}

export class DirectionStringValidator implements IDirectionStringValidator {
  private readonly validDirections: Set<string>;

  constructor() {
    this.validDirections = new Set(Object.values(Direction));
  }

  validateDirectionString(value: string, fieldName: string): void {
    if (!this.isValidDirectionString(value)) {
      throw new InvalidArgumentError(
        fieldName,
        value,
        Array.from(this.validDirections)
      );
    }
  }

  isValidDirectionString(value: string): boolean {
    return this.validDirections.has(value);
  }
}
