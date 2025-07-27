import { ErrorName } from "src/types/errors/ErrorNames";

export abstract class BaseError extends Error {
  constructor(message: string, name: ErrorName) {
    super(message);
    this.name = name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
