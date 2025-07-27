import * as fs from "fs";
import * as path from "path";
import { FileInputReader } from "src/infrastructure/FileInputReader";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs");
vi.mock("path");

describe("FileInputReader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should load file successfully", () => {
      const filePath = "test.txt";
      const absolutePath = "/absolute/test.txt";
      const fileContent = "line1\nline2\n\nline3\n";

      vi.mocked(path.resolve).mockReturnValue(absolutePath);
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader(filePath);

      expect(path.resolve).toHaveBeenCalledWith(filePath);
      expect(fs.readFileSync).toHaveBeenCalledWith(absolutePath, "utf-8");
    });

    it("should throw error when file cannot be read", () => {
      const filePath = "nonexistent.txt";
      const error = new Error("ENOENT: no such file or directory");

      vi.mocked(path.resolve).mockReturnValue("/absolute/nonexistent.txt");
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw error;
      });

      expect(() => new FileInputReader(filePath)).toThrow(
        "Failed to read file nonexistent.txt: ENOENT: no such file or directory"
      );
    });

    it("should handle unknown errors", () => {
      const filePath = "test.txt";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw "string error";
      });

      expect(() => new FileInputReader(filePath)).toThrow(
        "Failed to read file test.txt: Unknown error"
      );
    });
  });

  describe("readLine", () => {
    it("should return lines sequentially", () => {
      const fileContent = "line1\nline2\nline3";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");

      expect(reader.readLine()).toBe("line1");
      expect(reader.readLine()).toBe("line2");
      expect(reader.readLine()).toBe("line3");
      expect(reader.readLine()).toBeNull();
    });

    it("should skip empty lines", () => {
      const fileContent = "line1\n\n\nline2\n";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");

      expect(reader.readLine()).toBe("line1");
      expect(reader.readLine()).toBe("line2");
      expect(reader.readLine()).toBeNull();
    });

    it("should trim whitespace from lines", () => {
      const fileContent = "  line1  \n\t line2 \t\n";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");

      expect(reader.readLine()).toBe("line1");
      expect(reader.readLine()).toBe("line2");
    });
  });

  describe("hasMoreInput", () => {
    it("should return true when there are more lines", () => {
      const fileContent = "line1\nline2";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");

      expect(reader.hasMoreInput()).toBe(true);
      reader.readLine();
      expect(reader.hasMoreInput()).toBe(true);
      reader.readLine();
      expect(reader.hasMoreInput()).toBe(false);
    });

    it("should return false when no more lines", () => {
      const fileContent = "line1";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");
      reader.readLine();

      expect(reader.hasMoreInput()).toBe(false);
    });
  });

  describe("reset", () => {
    it("should reset current index to beginning", () => {
      const fileContent = "line1\nline2\nline3";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");
      reader.readLine();
      reader.readLine();

      reader.reset();

      expect(reader.readLine()).toBe("line1");
    });
  });

  describe("getAllLines", () => {
    it("should return all remaining lines and advance index", () => {
      const fileContent = "line1\nline2\nline3";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");
      reader.readLine(); // Read first line

      const remaining = reader.getAllLines();
      expect(remaining).toEqual(["line2", "line3"]);
      expect(reader.hasMoreInput()).toBe(false);
    });

    it("should return empty array when no lines remaining", () => {
      const fileContent = "line1";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");
      reader.readLine();

      const remaining = reader.getAllLines();
      expect(remaining).toEqual([]);
    });
  });

  describe("getTotalLines", () => {
    it("should return total number of lines", () => {
      const fileContent = "line1\nline2\nline3";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");

      expect(reader.getTotalLines()).toBe(3);
    });

    it("should exclude empty lines from count", () => {
      const fileContent = "line1\n\nline2\n\n";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");

      expect(reader.getTotalLines()).toBe(2);
    });
  });

  describe("getCurrentLineNumber", () => {
    it("should return current line number", () => {
      const fileContent = "line1\nline2\nline3";
      vi.mocked(path.resolve).mockReturnValue("/absolute/test.txt");
      vi.mocked(fs.readFileSync).mockReturnValue(fileContent);

      const reader = new FileInputReader("test.txt");

      expect(reader.getCurrentLineNumber()).toBe(0);
      reader.readLine();
      expect(reader.getCurrentLineNumber()).toBe(1);
      reader.readLine();
      expect(reader.getCurrentLineNumber()).toBe(2);
    });
  });
});
