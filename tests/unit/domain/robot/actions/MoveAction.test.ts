import { MovementCalculator } from "src/domain/direction/MovementCalculator";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { MoveAction } from "src/domain/robot/actions/MoveAction";
import { TableBoundsCoordinateValidator } from "src/domain/validation/table";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/direction/MovementCalculator");
vi.mock("src/domain/Position");
vi.mock("src/domain/validation/table");

describe("MoveAction", () => {
  let moveAction: MoveAction;

  beforeEach(() => {
    moveAction = new MoveAction();
  });

  it("should implement IRobotAction interface", () => {
    expect(typeof moveAction.execute).toBe("function");
  });

  it("should return false when robot is not placed", () => {
    const mockRobot = {
      isPlaced: false,
    } as Robot;

    const result = moveAction.execute(mockRobot);

    expect(result).toBe(false);
  });

  it("should calculate next coordinates when robot is placed", () => {
    const mockRobot = {
      isPlaced: true,
      position: { x: 1, y: 1 } as Position,
      direction: "NORTH" as any,
      table: {} as any,
      setPosition: vi.fn(),
    } as unknown as Robot;

    const mockCalculateNextCoordinates = vi.mocked(
      MovementCalculator.calculateNextCoordinates
    );
    mockCalculateNextCoordinates.mockReturnValue({ x: 1, y: 2 });

    const mockValidator = {
      isValidCoordinates: vi.fn().mockReturnValue(true),
    };
    vi.mocked(TableBoundsCoordinateValidator).mockImplementation(
      () => mockValidator as any
    );

    moveAction.execute(mockRobot);

    expect(mockCalculateNextCoordinates).toHaveBeenCalledWith(
      mockRobot.position,
      mockRobot.direction
    );
  });

  it("should return false when next coordinates are invalid", () => {
    const mockRobot = {
      isPlaced: true,
      position: { x: 1, y: 1 } as Position,
      direction: "NORTH" as any,
      table: {} as any,
      setPosition: vi.fn(),
    } as unknown as Robot;

    const mockCalculateNextCoordinates = vi.mocked(
      MovementCalculator.calculateNextCoordinates
    );
    mockCalculateNextCoordinates.mockReturnValue({ x: 5, y: 5 });

    const mockValidator = {
      isValidCoordinates: vi.fn().mockReturnValue(false),
    };
    vi.mocked(TableBoundsCoordinateValidator).mockImplementation(
      () => mockValidator as any
    );

    const result = moveAction.execute(mockRobot);

    expect(result).toBe(false);
    expect(mockRobot.setPosition).not.toHaveBeenCalled();
  });

  it("should update robot position when coordinates are valid", () => {
    const mockRobot = {
      isPlaced: true,
      position: { x: 1, y: 1 } as Position,
      direction: "NORTH" as any,
      table: {} as any,
      setPosition: vi.fn(),
    } as unknown as Robot;

    const mockCalculateNextCoordinates = vi.mocked(
      MovementCalculator.calculateNextCoordinates
    );
    mockCalculateNextCoordinates.mockReturnValue({ x: 1, y: 2 });

    const mockValidator = {
      isValidCoordinates: vi.fn().mockReturnValue(true),
    };
    vi.mocked(TableBoundsCoordinateValidator).mockImplementation(
      () => mockValidator as any
    );

    const result = moveAction.execute(mockRobot);

    expect(result).toBe(true);
    expect(mockRobot.setPosition).toHaveBeenCalledWith(expect.any(Position));
  });
});
