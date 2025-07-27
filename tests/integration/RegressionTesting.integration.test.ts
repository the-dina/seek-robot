import { RobotApplication } from "src/app";
import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";

describe("Regression Testing Integration Tests", () => {
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

  describe("Consistency and Regression Tests", () => {
    it("should maintain consistent behavior across multiple runs", () => {
      // Run the same file multiple times to ensure consistency
      const runs = 3;
      const expectedOutput = "3,3,NORTH";

      for (let i = 0; i < runs; i++) {
        mockOutput = []; // Clear previous output
        app.runFromFile("test-data/example3.txt");
        expect(mockOutput).toContain(expectedOutput);
        app.reset();
      }
    });

    it("should handle rapid successive file executions", () => {
      const files = [
        { file: "test-data/example1.txt", expected: "0,1,NORTH" },
        { file: "test-data/example2.txt", expected: "0,0,WEST" },
        { file: "test-data/example3.txt", expected: "3,3,NORTH" },
      ];

      files.forEach(({ file, expected }) => {
        mockOutput = []; // Clear for each test
        app.runFromFile(file);
        expect(mockOutput).toContain(expected);
        app.reset();
      });
    });

    it("should maintain state isolation between command sequences", () => {
      // Test that each command sequence starts with a clean state
      app.processCommand("PLACE 2,2,NORTH");
      app.processCommand("MOVE");
      app.processCommand("REPORT");
      expect(mockOutput).toContain("2,3,NORTH");

      app.reset();
      mockOutput = [];

      app.processCommand("PLACE 0,0,SOUTH");
      app.processCommand("REPORT");
      expect(mockOutput).toContain("0,0,SOUTH");
      expect(mockOutput).not.toContain("2,3,NORTH");
    });

    it("should handle repeated command processing without memory leaks", () => {
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        mockOutput = [];
        app.processCommand("PLACE 1,1,EAST");
        app.processCommand("MOVE");
        app.processCommand("REPORT");
        expect(mockOutput).toContain("2,1,EAST");
        app.reset();
      }
    });
  });
});
