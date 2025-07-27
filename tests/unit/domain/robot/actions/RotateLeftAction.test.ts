import { Direction } from "src/domain/Direction";
import { DirectionOperationFactory } from "src/domain/direction/operations";
import { Robot } from "src/domain/Robot";
import { RotateLeftAction } from "src/domain/robot/actions/RotateLeftAction";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/direction/operations");

describe("RotateLeftAction", () => {
  let rotateLeftAction: RotateLeftAction;

  beforeEach(() => {
    rotateLeftAction = new RotateLeftAction();
  });

  it("should implement IRobotAction interface", () => {
    expect(typeof rotateLeftAction.execute).toBe("function");
  });

  it("should return false when robot is not placed", () => {
    const mockRobot = {
      isPlaced: false,
    } as Robot;

    const result = rotateLeftAction.execute(mockRobot);

    expect(result).toBe(false);
  });

  it("should create rotate left operation when robot is placed", () => {
    const mockRobot = {
      isPlaced: true,
      direction: Direction.NORTH,
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockOperation = {
      execute: vi.fn().mockReturnValue(Direction.WEST),
    };
    vi.mocked(
      DirectionOperationFactory.createRotateLeftOperation
    ).mockReturnValue(mockOperation);

    rotateLeftAction.execute(mockRobot);

    expect(
      DirectionOperationFactory.createRotateLeftOperation
    ).toHaveBeenCalled();
  });

  it("should execute operation with current direction", () => {
    const mockRobot = {
      isPlaced: true,
      direction: Direction.NORTH,
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockOperation = {
      execute: vi.fn().mockReturnValue(Direction.WEST),
    };
    vi.mocked(
      DirectionOperationFactory.createRotateLeftOperation
    ).mockReturnValue(mockOperation);

    rotateLeftAction.execute(mockRobot);

    expect(mockOperation.execute).toHaveBeenCalledWith(Direction.NORTH);
  });

  it("should set robot direction to operation result", () => {
    const mockRobot = {
      isPlaced: true,
      direction: Direction.NORTH,
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockOperation = {
      execute: vi.fn().mockReturnValue(Direction.WEST),
    };
    vi.mocked(
      DirectionOperationFactory.createRotateLeftOperation
    ).mockReturnValue(mockOperation);

    const result = rotateLeftAction.execute(mockRobot);

    expect(result).toBe(true);
    expect(mockRobot.setDirection).toHaveBeenCalledWith(Direction.WEST);
  });
});
