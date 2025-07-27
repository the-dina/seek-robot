import { BaseError } from "src/types/errors/BaseError";
import { ErrorNames } from "src/types/errors/ErrorNames";

export class InvalidArgumentError extends BaseError {
  constructor(argumentName: string, value: unknown, validValues?: string[]) {
    let message = `Invalid ${argumentName}: ${value}`;

    if (validValues && validValues.length > 0) {
      message += `. Valid values are: ${validValues.join(", ")}`;
    }

    super(message, ErrorNames.INVALID_ARGUMENT);
  }
}
