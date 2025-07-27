import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { Table } from "src/domain/Table";
import { IRobotAction } from "src/domain/robot/actions";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/Position");
vi.mock("src/domain/Table");

describe("Robot", () => {
  let table: Table;
  let robot: Robot;

  beforeEach(() => {
    table = new Table(5, 5);
    robot = new Robot(table);
  });

  it("should initialize with null position and direction", () => {
    expect(robot.position).toBeNull();
    expect(robot.direction).toBeNull();
    expect(robot.isPlaced).toBe(false);
  });

  it("should store the table reference", () => {
    expect(robot.table).toBe(table);
  });

  it("should set and get position", () => {
    const position = new Position(1, 2);

    robot.setPosition(position);

    expect(robot.position).toBe(position);
  });

  it("should set and get direction", () => {
    robot.setDirection(Direction.NORTH);

    expect(robot.direction).toBe(Direction.NORTH);
  });

  it("should report not placed when only position is set", () => {
    robot.setPosition(new Position(1, 2));

    expect(robot.isPlaced).toBe(false);
  });

  it("should report not placed when only direction is set", () => {
    robot.setDirection(Direction.NORTH);

    expect(robot.isPlaced).toBe(false);
  });

  it("should report placed when both position and direction are set", () => {
    robot.setPosition(new Position(1, 2));
    robot.setDirection(Direction.NORTH);

    expect(robot.isPlaced).toBe(true);
  });

  it("should execute action and return result", () => {
    const mockAction: IRobotAction = {
      execute: vi.fn().mockReturnValue(true),
    };

    const result = robot.executeAction(mockAction);

    expect(mockAction.execute).toHaveBeenCalledWith(robot);
    expect(result).toBe(true);
  });

  it("should execute action and return false result", () => {
    const mockAction: IRobotAction = {
      execute: vi.fn().mockReturnValue(false),
    };

    const result = robot.executeAction(mockAction);

    expect(result).toBe(false);
  });
});
