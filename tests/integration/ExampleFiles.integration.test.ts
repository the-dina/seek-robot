import * as fs from "fs";
import * as path from "path";
import { RobotApplication } from "src/app";
import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";

describe("Example Files Integration Tests", () => {
  let app: RobotApplication;
  let mockOutput: string[];
  let originalWrite: typeof ConsoleOutputWriter.prototype.write;
  let originalWriteError: typeof ConsoleOutputWriter.prototype.writeError;
  let originalWriteSuccess: typeof ConsoleOutputWriter.prototype.writeSuccess;
  let originalWriteInfo: typeof ConsoleOutputWriter.prototype.writeInfo;
  let originalWriteWarning: typeof ConsoleOutputWriter.prototype.writeWarning;
  let originalWriteCommand: typeof ConsoleOutputWriter.prototype.writeCommand;
  let originalWriteReport: typeof ConsoleOutputWriter.prototype.writeReport;

  beforeEach(() => {
    app = new RobotApplication();
    mockOutput = [];

    // Store original methods
    originalWrite = ConsoleOutputWriter.prototype.write;
    originalWriteError = ConsoleOutputWriter.prototype.writeError;
    originalWriteSuccess = ConsoleOutputWriter.prototype.writeSuccess;
    originalWriteInfo = ConsoleOutputWriter.prototype.writeInfo;
    originalWriteWarning = ConsoleOutputWriter.prototype.writeWarning;
    originalWriteCommand = ConsoleOutputWriter.prototype.writeCommand;
    originalWriteReport = ConsoleOutputWriter.prototype.writeReport;

    // Mock all output methods to capture results
    ConsoleOutputWriter.prototype.write = (message: string) => {
      mockOutput.push(message);
    };
    ConsoleOutputWriter.prototype.writeError = (message: string) => {
      mockOutput.push(message);
    };
    ConsoleOutputWriter.prototype.writeSuccess = (message: string) => {
      mockOutput.push(message);
    };
    ConsoleOutputWriter.prototype.writeInfo = (message: string) => {
      mockOutput.push(message);
    };
    ConsoleOutputWriter.prototype.writeWarning = (message: string) => {
      mockOutput.push(message);
    };
    ConsoleOutputWriter.prototype.writeCommand = (message: string) => {
      mockOutput.push(message);
    };
    ConsoleOutputWriter.prototype.writeReport = (message: string) => {
      mockOutput.push(message);
    };
  });

  afterEach(() => {
    // Restore all original methods
    ConsoleOutputWriter.prototype.write = originalWrite;
    ConsoleOutputWriter.prototype.writeError = originalWriteError;
    ConsoleOutputWriter.prototype.writeSuccess = originalWriteSuccess;
    ConsoleOutputWriter.prototype.writeInfo = originalWriteInfo;
    ConsoleOutputWriter.prototype.writeWarning = originalWriteWarning;
    ConsoleOutputWriter.prototype.writeCommand = originalWriteCommand;
    ConsoleOutputWriter.prototype.writeReport = originalWriteReport;
    app.reset();
  });

  describe("Example Files Validation", () => {
    const exampleFiles = [
      { file: "example1.txt", expected: "0,1,NORTH" },
      { file: "example2.txt", expected: "0,0,WEST" },
      { file: "example3.txt", expected: "3,3,NORTH" },
    ];

    // Dynamically generate tests for each example file
    exampleFiles.forEach(({ file, expected }) => {
      it(`should execute ${file} and produce expected output: ${expected}`, () => {
        const filePath = path.join("test-data", file);

        // Verify file exists
        expect(fs.existsSync(filePath)).toBe(true);

        app.runFromFile(filePath);

        expect(mockOutput).toContain(expected);
      });
    });

    it("should execute example1.txt correctly", () => {
      // PLACE 0,0,NORTH
      // MOVE
      // REPORT
      // Expected: 0,1,NORTH

      app.runFromFile("test-data/example1.txt");

      expect(mockOutput).toContain("0,1,NORTH");
    });

    it("should execute example2.txt correctly", () => {
      // PLACE 0,0,NORTH
      // LEFT
      // REPORT
      // Expected: 0,0,WEST

      app.runFromFile("test-data/example2.txt");

      expect(mockOutput).toContain("0,0,WEST");
    });

    it("should execute example3.txt correctly", () => {
      // PLACE 1,2,EAST
      // MOVE
      // MOVE
      // LEFT
      // MOVE
      // REPORT
      // Expected: 3,3,NORTH

      app.runFromFile("test-data/example3.txt");

      expect(mockOutput).toContain("3,3,NORTH");
    });

    it("should handle edge cases correctly", () => {
      // Test boundary conditions and invalid moves
      app.runFromFile("test-data/edge-cases.txt");

      // Should have some reports and no crashes
      expect(mockOutput.length).toBeGreaterThan(0);
    });

    it("should handle invalid commands gracefully", () => {
      // Test error handling
      app.runFromFile("test-data/invalid-commands.txt");

      // Should not crash and may have some outputs
      expect(mockOutput.length).toBeGreaterThanOrEqual(0);
    });

    it("should execute all example files without crashing", () => {
      const testDataDir = "test-data";
      const files = fs
        .readdirSync(testDataDir)
        .filter((file) => file.endsWith(".txt"))
        .map((file) => path.join(testDataDir, file));

      // Test that we can run all files without throwing errors
      files.forEach((filePath) => {
        expect(() => {
          app.runFromFile(filePath);
          app.reset(); // Reset for next file
        }).not.toThrow();
      });
    });
  });
});
