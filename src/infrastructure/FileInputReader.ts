import * as fs from "fs";
import * as path from "path";
import { IInputReader } from "src/types";

export class FileInputReader implements IInputReader {
  private lines: string[] = [];
  private currentIndex: number = 0;

  constructor(filePath: string) {
    this.loadFile(filePath);
  }

  private loadFile(filePath: string): void {
    try {
      const absolutePath = path.resolve(filePath);
      const content = fs.readFileSync(absolutePath, "utf-8");
      this.lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      this.currentIndex = 0;
    } catch (error) {
      throw new Error(
        `Failed to read file ${filePath}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  readLine(): string | null {
    if (this.currentIndex < this.lines.length) {
      return this.lines[this.currentIndex++];
    }
    return null;
  }

  hasMoreInput(): boolean {
    return this.currentIndex < this.lines.length;
  }

  reset(): void {
    this.currentIndex = 0;
  }

  getAllLines(): string[] {
    const remaining = this.lines.slice(this.currentIndex);
    this.currentIndex = this.lines.length;
    return remaining;
  }

  getTotalLines(): number {
    return this.lines.length;
  }

  getCurrentLineNumber(): number {
    return this.currentIndex;
  }
}
