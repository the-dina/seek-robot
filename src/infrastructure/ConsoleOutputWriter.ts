import { IOutputWriter } from "src/types";

export class ConsoleOutputWriter implements IOutputWriter {
  private readonly colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
  };

  write(message: string): void {
    console.log(message);
  }

  writeError(message: string): void {
    console.error(`${this.colors.red}${message}${this.colors.reset}`);
  }

  writeSuccess(message: string): void {
    console.log(`${this.colors.green}${message}${this.colors.reset}`);
  }

  writeInfo(message: string): void {
    console.log(`${this.colors.cyan}${message}${this.colors.reset}`);
  }

  writeWarning(message: string): void {
    console.log(`${this.colors.yellow}${message}${this.colors.reset}`);
  }

  writeCommand(message: string): void {
    console.log(`${this.colors.gray}${message}${this.colors.reset}`);
  }

  writeReport(message: string): void {
    console.log(
      `${this.colors.bright}${this.colors.magenta}${message}${this.colors.reset}`
    );
  }
}
