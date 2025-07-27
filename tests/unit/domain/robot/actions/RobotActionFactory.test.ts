import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { MoveAction } from "src/domain/robot/actions/MoveAction";
import { PlaceAction } from "src/domain/robot/actions/PlaceAction";
import { RobotActionFactory } from "src/domain/robot/actions/RobotActionFactory";
import { RotateLeftAction } from "src/domain/robot/actions/RotateLeftAction";
import { RotateRightAction } from "src/domain/robot/actions/RotateRightAction";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/robot/actions/MoveAction");
vi.mock("src/domain/robot/actions/PlaceAction");
vi.mock("src/domain/robot/actions/RotateLeftAction");
vi.mock("src/domain/robot/actions/RotateRightAction");
vi.mock("src/domain/Position");

describe("RobotActionFactory", () => {
  it("should create MoveAction instance", () => {
    const action = RobotActionFactory.createMoveAction();

    expect(action).toBeInstanceOf(MoveAction);
  });

  it("should create RotateLeftAction instance", () => {
    const action = RobotActionFactory.createRotateLeftAction();

    expect(action).toBeInstanceOf(RotateLeftAction);
  });

  it("should create RotateRightAction instance", () => {
    const action = RobotActionFactory.createRotateRightAction();

    expect(action).toBeInstanceOf(RotateRightAction);
  });

  it("should create PlaceAction instance with position and direction", () => {
    const mockPosition = new Position(1, 2);
    const direction = Direction.NORTH;

    const action = RobotActionFactory.createPlaceAction(
      mockPosition,
      direction
    );

    expect(action).toBeInstanceOf(PlaceAction);
  });

  it("should create new instances on each call", () => {
    const action1 = RobotActionFactory.createMoveAction();
    const action2 = RobotActionFactory.createMoveAction();

    expect(action1).not.toBe(action2);
  });

  it("should return objects implementing IRobotAction interface", () => {
    const moveAction = RobotActionFactory.createMoveAction();
    const rotateLeftAction = RobotActionFactory.createRotateLeftAction();
    const rotateRightAction = RobotActionFactory.createRotateRightAction();
    const placeAction = RobotActionFactory.createPlaceAction(
      new Position(0, 0),
      Direction.NORTH
    );

    expect(typeof moveAction.execute).toBe("function");
    expect(typeof rotateLeftAction.execute).toBe("function");
    expect(typeof rotateRightAction.execute).toBe("function");
    expect(typeof placeAction.execute).toBe("function");
  });
});
