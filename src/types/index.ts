export interface IOutputWriter {
  write(message: string): void;
  writeError(message: string): void;
  writeSuccess(message: string): void;
  writeInfo(message: string): void;
  writeWarning(message: string): void;
  writeCommand(message: string): void;
  writeReport(message: string): void;
}

export interface IInputReader {
  readLine(): string | null;
  hasMoreInput(): boolean;
}

export interface IInteractiveInputReader extends IInputReader {
  onCommand(callback: (command: string) => void): void;
}

export interface ICommandResult {
  success: boolean;
  output?: string;
  error?: string;
}

// Named re-export for better tree shaking
export {
  BaseError,
  ErrorNames,
  InvalidArgumentError,
  type ErrorName,
} from "./errors";
