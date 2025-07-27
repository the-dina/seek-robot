import { Direction } from "src/domain/Direction";
import { DirectionOperationFactory } from "src/domain/direction/operations";
import { Robot } from "src/domain/Robot";
import { RotateRightAction } from "src/domain/robot/actions/RotateRightAction";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/direction/operations");

describe("RotateRightAction", () => {
  let rotateRightAction: RotateRightAction;

  beforeEach(() => {
    rotateRightAction = new RotateRightAction();
  });

  it("should implement IRobotAction interface", () => {
    expect(typeof rotateRightAction.execute).toBe("function");
  });

  it("should return false when robot is not placed", () => {
    const mockRobot = {
      isPlaced: false,
    } as Robot;

    const result = rotateRightAction.execute(mockRobot);

    expect(result).toBe(false);
  });

  it("should create rotate right operation when robot is placed", () => {
    const mockRobot = {
      isPlaced: true,
      direction: Direction.NORTH,
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockOperation = {
      execute: vi.fn().mockReturnValue(Direction.EAST),
    };
    vi.mocked(
      DirectionOperationFactory.createRotateRightOperation
    ).mockReturnValue(mockOperation);

    rotateRightAction.execute(mockRobot);

    expect(
      DirectionOperationFactory.createRotateRightOperation
    ).toHaveBeenCalled();
  });

  it("should execute operation with current direction", () => {
    const mockRobot = {
      isPlaced: true,
      direction: Direction.NORTH,
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockOperation = {
      execute: vi.fn().mockReturnValue(Direction.EAST),
    };
    vi.mocked(
      DirectionOperationFactory.createRotateRightOperation
    ).mockReturnValue(mockOperation);

    rotateRightAction.execute(mockRobot);

    expect(mockOperation.execute).toHaveBeenCalledWith(Direction.NORTH);
  });

  it("should set robot direction to operation result", () => {
    const mockRobot = {
      isPlaced: true,
      direction: Direction.NORTH,
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockOperation = {
      execute: vi.fn().mockReturnValue(Direction.EAST),
    };
    vi.mocked(
      DirectionOperationFactory.createRotateRightOperation
    ).mockReturnValue(mockOperation);

    const result = rotateRightAction.execute(mockRobot);

    expect(result).toBe(true);
    expect(mockRobot.setDirection).toHaveBeenCalledWith(Direction.EAST);
  });
});
