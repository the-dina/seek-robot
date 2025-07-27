import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { RobotReporter } from "src/domain/robot/RobotReporter";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/Robot");
vi.mock("src/domain/Position");

describe("RobotReporter", () => {
  let reporter: RobotReporter;

  beforeEach(() => {
    reporter = new RobotReporter();
  });

  it("should return null when robot is not placed", () => {
    const mockRobot = {
      isPlaced: false,
      position: null,
      direction: null,
    } as Robot;

    const result = reporter.generateReport(mockRobot);

    expect(result).toBeNull();
  });

  it("should return formatted string when robot is placed", () => {
    const mockRobot = {
      isPlaced: true,
      position: { x: 2, y: 3 } as Position,
      direction: Direction.NORTH,
    } as Robot;

    const result = reporter.generateReport(mockRobot);

    expect(result).toBe("2,3,NORTH");
  });

  it("should format coordinates and direction correctly", () => {
    const mockRobot = {
      isPlaced: true,
      position: { x: 0, y: 4 } as Position,
      direction: Direction.WEST,
    } as Robot;

    const result = reporter.generateReport(mockRobot);

    expect(result).toBe("0,4,WEST");
  });

  it("should handle different directions", () => {
    const mockRobot1 = {
      isPlaced: true,
      position: { x: 1, y: 1 } as Position,
      direction: Direction.SOUTH,
    } as Robot;

    const mockRobot2 = {
      isPlaced: true,
      position: { x: 1, y: 1 } as Position,
      direction: Direction.EAST,
    } as Robot;

    expect(reporter.generateReport(mockRobot1)).toBe("1,1,SOUTH");
    expect(reporter.generateReport(mockRobot2)).toBe("1,1,EAST");
  });
});
