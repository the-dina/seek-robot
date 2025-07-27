import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { PlaceAction } from "src/domain/robot/actions/PlaceAction";
import { TableBoundsPositionValidator } from "src/domain/validation/table";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("src/domain/Position");
vi.mock("src/domain/validation/table");

describe("PlaceAction", () => {
  let mockPosition: Position;
  let direction: Direction;
  let placeAction: PlaceAction;

  beforeEach(() => {
    mockPosition = { x: 1, y: 2 } as Position;
    direction = Direction.NORTH;
    placeAction = new PlaceAction(mockPosition, direction);
  });

  it("should implement IRobotAction interface", () => {
    expect(typeof placeAction.execute).toBe("function");
  });

  it("should store position and direction from constructor", () => {
    // Access private fields through any cast for testing
    const action = placeAction as any;
    expect(action.position).toBe(mockPosition);
    expect(action.direction).toBe(direction);
  });

  it("should return false when position is invalid", () => {
    const mockRobot = {
      table: {} as any,
      setPosition: vi.fn(),
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockValidator = {
      isValidPosition: vi.fn().mockReturnValue(false),
    };
    vi.mocked(TableBoundsPositionValidator).mockImplementation(
      () => mockValidator as any
    );

    const result = placeAction.execute(mockRobot);

    expect(result).toBe(false);
    expect(mockRobot.setPosition).not.toHaveBeenCalled();
    expect(mockRobot.setDirection).not.toHaveBeenCalled();
  });

  it("should validate position using TableBoundsPositionValidator", () => {
    const mockRobot = {
      table: {} as any,
      setPosition: vi.fn(),
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockValidator = {
      isValidPosition: vi.fn().mockReturnValue(true),
    };
    vi.mocked(TableBoundsPositionValidator).mockImplementation(
      () => mockValidator as any
    );

    placeAction.execute(mockRobot);

    expect(mockValidator.isValidPosition).toHaveBeenCalledWith(mockPosition);
  });

  it("should set robot position and direction when position is valid", () => {
    const mockRobot = {
      table: {} as any,
      setPosition: vi.fn(),
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockValidator = {
      isValidPosition: vi.fn().mockReturnValue(true),
    };
    vi.mocked(TableBoundsPositionValidator).mockImplementation(
      () => mockValidator as any
    );

    const result = placeAction.execute(mockRobot);

    expect(result).toBe(true);
    expect(mockRobot.setPosition).toHaveBeenCalledWith(mockPosition);
    expect(mockRobot.setDirection).toHaveBeenCalledWith(direction);
  });

  it("should work with different directions", () => {
    const eastAction = new PlaceAction(mockPosition, Direction.EAST);
    const mockRobot = {
      table: {} as any,
      setPosition: vi.fn(),
      setDirection: vi.fn(),
    } as unknown as Robot;

    const mockValidator = {
      isValidPosition: vi.fn().mockReturnValue(true),
    };
    vi.mocked(TableBoundsPositionValidator).mockImplementation(
      () => mockValidator as any
    );

    eastAction.execute(mockRobot);

    expect(mockRobot.setDirection).toHaveBeenCalledWith(Direction.EAST);
  });
});
