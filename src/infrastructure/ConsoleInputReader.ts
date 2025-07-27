import * as readline from "readline";
import { IInteractiveInputReader } from "src/types";

export class ConsoleInputReader implements IInteractiveInputReader {
  private rl: readline.Interface;
  private inputQueue: string[] = [];
  private isReading: boolean = false;
  private resolvePromise?: () => void;
  private commandCallback?: (command: string) => void;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });
  }

  readLine(): string | null {
    if (this.inputQueue.length > 0) {
      return this.inputQueue.shift() || null;
    }
    return null;
  }

  hasMoreInput(): boolean {
    return this.inputQueue.length > 0 || !this.isReading;
  }

  async startReading(): Promise<void> {
    return new Promise((resolve) => {
      this.isReading = true;
      this.resolvePromise = resolve;

      this.rl.on("line", this.handleLineInput.bind(this));
      this.rl.on("close", this.handleClose.bind(this));

      this.rl.prompt();
    });
  }

  getQueuedCommands(): string[] {
    const commands = [...this.inputQueue];
    this.inputQueue = [];
    return commands;
  }

  onCommand(callback: (command: string) => void): void {
    this.commandCallback = callback;
  }

  close(): void {
    this.rl.close();
    this.isReading = false;
  }

  prompt(): void {
    if (this.isReading) {
      this.rl.prompt();
    }
  }

  private isExitCommand(command: string): boolean {
    const upperCommand = command.toUpperCase();
    return upperCommand === "EXIT" || upperCommand === "QUIT";
  }

  private handleLineInput(input: string): void {
    const trimmed = input.trim();
    if (this.isExitCommand(trimmed)) {
      this.close();
      process.exit(0);
    }

    if (this.commandCallback) {
      this.commandCallback(trimmed);
    } else {
      this.inputQueue.push(trimmed);
    }
  }

  private handleClose(): void {
    this.isReading = false;
    if (this.resolvePromise) {
      this.resolvePromise();
    }
  }
}
