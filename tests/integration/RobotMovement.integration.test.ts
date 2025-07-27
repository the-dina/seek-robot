import { RobotApplication } from "src/app";
import { ConsoleOutputWriter } from "src/infrastructure/ConsoleOutputWriter";

describe("Robot Movement Integration Tests", () => {
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

  describe("Complex Movement Sequences", () => {
    it("should handle complex movement sequences", () => {
      const commands = [
        "PLACE 0,0,NORTH",
        "MOVE",
        "RIGHT",
        "MOVE",
        "MOVE",
        "RIGHT",
        "MOVE",
        "REPORT",
      ];

      commands.forEach((command) => app.processCommand(command));

      expect(mockOutput).toContain("2,0,SOUTH");
    });

    it("should handle multiple PLACE commands", () => {
      app.processCommand("PLACE 0,0,NORTH");
      app.processCommand("MOVE");
      app.processCommand("PLACE 4,4,WEST"); // Replace position
      app.processCommand("REPORT");

      expect(mockOutput).toContain("4,4,WEST");
    });

    it("should handle full table traversal", () => {
      // Start at bottom-left, go to top-right
      app.processCommand("PLACE 0,0,NORTH");

      // Move to top
      for (let i = 0; i < 4; i++) {
        app.processCommand("MOVE");
      }

      // Turn right to face east
      app.processCommand("RIGHT");

      // Move to right edge
      for (let i = 0; i < 4; i++) {
        app.processCommand("MOVE");
      }

      app.processCommand("REPORT");
      expect(mockOutput).toContain("4,4,EAST");
    });

    it("should handle circular movement pattern", () => {
      app.processCommand("PLACE 2,2,NORTH");

      // Move in a square: up, right, down, left
      app.processCommand("MOVE"); // 2,3,NORTH
      app.processCommand("RIGHT"); // 2,3,EAST
      app.processCommand("MOVE"); // 3,3,EAST
      app.processCommand("RIGHT"); // 3,3,SOUTH
      app.processCommand("MOVE"); // 3,2,SOUTH
      app.processCommand("RIGHT"); // 3,2,WEST
      app.processCommand("MOVE"); // 2,2,WEST
      app.processCommand("RIGHT"); // 2,2,NORTH (back to start direction)

      app.processCommand("REPORT");
      expect(mockOutput).toContain("2,2,NORTH");
    });
  });

  describe("Rotation Behavior", () => {
    it("should handle 360-degree rotation", () => {
      app.processCommand("PLACE 2,2,NORTH");

      // Full rotation right
      app.processCommand("RIGHT"); // EAST
      app.processCommand("RIGHT"); // SOUTH
      app.processCommand("RIGHT"); // WEST
      app.processCommand("RIGHT"); // NORTH (back to start)

      app.processCommand("REPORT");
      expect(mockOutput).toContain("2,2,NORTH");
    });

    it("should handle counter-clockwise rotation", () => {
      app.processCommand("PLACE 2,2,NORTH");

      // Full rotation left
      app.processCommand("LEFT"); // WEST
      app.processCommand("LEFT"); // SOUTH
      app.processCommand("LEFT"); // EAST
      app.processCommand("LEFT"); // NORTH (back to start)

      app.processCommand("REPORT");
      expect(mockOutput).toContain("2,2,NORTH");
    });

    it("should handle mixed rotations", () => {
      app.processCommand("PLACE 2,2,NORTH");

      app.processCommand("RIGHT"); // EAST
      app.processCommand("LEFT"); // NORTH
      app.processCommand("LEFT"); // WEST
      app.processCommand("RIGHT"); // NORTH

      app.processCommand("REPORT");
      expect(mockOutput).toContain("2,2,NORTH");
    });
  });

  describe("Boundary Movement Behavior", () => {
    it("should handle movement at table boundaries", () => {
      // Test all corners
      const cornerTests = [
        { start: "0,0,SOUTH", move: "MOVE", expected: "0,0,SOUTH" }, // Bottom-left, can't go down
        { start: "0,0,WEST", move: "MOVE", expected: "0,0,WEST" }, // Bottom-left, can't go left
        { start: "4,4,NORTH", move: "MOVE", expected: "4,4,NORTH" }, // Top-right, can't go up
        { start: "4,4,EAST", move: "MOVE", expected: "4,4,EAST" }, // Top-right, can't go right
      ];

      cornerTests.forEach(({ start, move, expected }) => {
        mockOutput = [];
        app.processCommand(`PLACE ${start}`);
        app.processCommand(move);
        app.processCommand("REPORT");
        expect(mockOutput).toContain(expected);
        app.reset();
      });
    });

    it("should handle edge walking", () => {
      // Walk along the top edge
      app.processCommand("PLACE 0,4,EAST");

      for (let i = 0; i < 4; i++) {
        app.processCommand("MOVE");
      }

      app.processCommand("REPORT");
      expect(mockOutput).toContain("4,4,EAST");
    });
  });

  describe("State Management", () => {
    it("should maintain robot state through complex sequences", () => {
      // Complex sequence that tests state consistency
      app.processCommand("PLACE 1,1,NORTH");
      app.processCommand("MOVE"); // 1,2,NORTH
      app.processCommand("LEFT"); // 1,2,WEST
      app.processCommand("MOVE"); // 0,2,WEST
      app.processCommand("LEFT"); // 0,2,SOUTH
      app.processCommand("MOVE"); // 0,1,SOUTH
      app.processCommand("LEFT"); // 0,1,EAST
      app.processCommand("MOVE"); // 1,1,EAST (back to start position)
      app.processCommand("LEFT"); // 1,1,NORTH (back to start direction)

      app.processCommand("REPORT");
      expect(mockOutput).toContain("1,1,NORTH");
    });

    it("should handle rapid state changes", () => {
      app.processCommand("PLACE 2,2,NORTH");

      // Rapid direction changes
      for (let i = 0; i < 10; i++) {
        app.processCommand("LEFT");
        app.processCommand("RIGHT");
      }

      app.processCommand("REPORT");
      expect(mockOutput).toContain("2,2,NORTH"); // Should be back to original
    });
  });
});
