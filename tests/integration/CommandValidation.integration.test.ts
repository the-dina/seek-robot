import { RobotApplication } from "src/app";
import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";

describe("Command Validation Integration Tests", () => {
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

  describe("Command Processing Validation", () => {
    it("should process individual commands correctly", () => {
      app.processCommand("PLACE 2,2,NORTH");
      app.processCommand("MOVE");
      app.processCommand("REPORT");

      expect(mockOutput).toContain("2,3,NORTH");
    });

    it("should ignore commands before valid PLACE", () => {
      app.processCommand("MOVE");
      app.processCommand("LEFT");
      app.processCommand("RIGHT");
      app.processCommand("REPORT");
      app.processCommand("PLACE 1,1,SOUTH");
      app.processCommand("REPORT");

      expect(mockOutput).toContain("1,1,SOUTH");
      // Should capture 4 error messages for invalid commands + 1 valid report = 5 total
      expect(mockOutput.length).toBe(5);
    });

    it("should prevent robot from falling off table", () => {
      app.processCommand("PLACE 0,0,SOUTH");
      app.processCommand("MOVE"); // Should be ignored
      app.processCommand("REPORT");

      expect(mockOutput).toContain("0,0,SOUTH");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid PLACE positions", () => {
      // These should be ignored
      app.processCommand("PLACE 5,5,NORTH"); // Off table
      app.processCommand("PLACE -1,0,NORTH"); // Negative
      app.processCommand("PLACE 0,5,NORTH"); // Off table
      app.processCommand("PLACE 2,2,NORTH"); // Valid
      app.processCommand("REPORT");

      expect(mockOutput).toContain("2,2,NORTH");
      // Should capture 3 error messages for invalid PLACE commands + 1 valid report = 4 total
      expect(mockOutput.length).toBe(4);
    });

    it("should handle invalid commands", () => {
      app.processCommand("PLACE 2,2,NORTH");
      app.processCommand("INVALID_COMMAND");
      app.processCommand("PLACE 1,1,INVALID_DIRECTION");
      app.processCommand("REPORT");

      expect(mockOutput).toContain("2,2,NORTH");
    });

    it("should handle malformed PLACE commands", () => {
      app.processCommand("PLACE"); // Missing arguments
      app.processCommand("PLACE 1"); // Insufficient arguments
      app.processCommand("PLACE 1,2"); // Missing direction
      app.processCommand("PLACE 1,2,3,4"); // Too many arguments
      app.processCommand("PLACE a,b,NORTH"); // Invalid coordinates
      app.processCommand("PLACE 1,2,NORTH"); // Valid command
      app.processCommand("REPORT");

      expect(mockOutput).toContain("1,2,NORTH");
    });

    it("should handle empty and whitespace commands", () => {
      app.processCommand("");
      app.processCommand("   ");
      app.processCommand("\t");
      app.processCommand("\n");
      app.processCommand("PLACE 0,0,NORTH");
      app.processCommand("REPORT");

      expect(mockOutput).toContain("0,0,NORTH");
    });
  });

  describe("Command Format Validation", () => {
    it("should handle case sensitivity correctly", () => {
      app.processCommand("place 1,1,north"); // lowercase
      app.processCommand("Place 1,1,North"); // mixed case
      app.processCommand("PLACE 1,1,NORTH"); // uppercase
      app.processCommand("REPORT");

      // Only the correctly formatted command should work
      expect(mockOutput).toContain("1,1,NORTH");
    });

    it("should handle commands with extra whitespace", () => {
      app.processCommand("  PLACE  1,1,NORTH  ");
      app.processCommand("  MOVE  ");
      app.processCommand("  REPORT  ");

      expect(mockOutput).toContain("1,2,NORTH");
    });
  });
});
