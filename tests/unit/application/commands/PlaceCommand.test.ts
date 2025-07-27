import { BaseCommand } from "src/application/commands/BaseCommand";
import { PlaceCommand } from "src/application/commands/PlaceCommand";
import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { RobotActionFactory } from "src/domain/robot/actions";
import { describe, expect, it, vi } from "vitest";

vi.mock("src/application/commands/BaseCommand");
vi.mock("src/domain/Position");
vi.mock("src/domain/robot/actions");

describe("PlaceCommand", () => {
  describe("execute", () => {
    it("should call BaseCommand.execute with correct parameters for successful placement", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockDirection = Direction.NORTH;
      const mockPosition = {};
      const mockAction = {};
      const mockResult = { success: true };

      vi.mocked(Position).mockImplementation(() => mockPosition as any);
      vi.mocked(RobotActionFactory.createPlaceAction).mockReturnValue(
        mockAction as any
      );
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        // Call the executor to trigger the action factory call
        executor(robot);
        return mockResult;
      });

      const placeCommand = new PlaceCommand(1, 2, mockDirection);
      const result = placeCommand.execute(mockRobot);

      expect(Position).toHaveBeenCalledWith(1, 2);
      expect(RobotActionFactory.createPlaceAction).toHaveBeenCalledWith(
        mockPosition,
        mockDirection
      );
      expect(BaseCommand.execute).toHaveBeenCalledWith(
        mockRobot,
        expect.any(Function),
        "Cannot place robot at position 1,2 - position is invalid",
        false
      );
      expect(result).toBe(mockResult);
    });

    it("should pass executor function that calls robot.executeAction with place action", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockDirection = Direction.SOUTH;
      const mockPosition = {};
      const mockAction = {};

      vi.mocked(Position).mockImplementation(() => mockPosition as any);
      vi.mocked(RobotActionFactory.createPlaceAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return { success: true };
      });

      const placeCommand = new PlaceCommand(3, 4, mockDirection);
      placeCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: true });
    });

    it("should handle robot action failure", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(false),
      } as any;
      const mockDirection = Direction.EAST;
      const mockPosition = {};
      const mockAction = {};

      vi.mocked(Position).mockImplementation(() => mockPosition as any);
      vi.mocked(RobotActionFactory.createPlaceAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return {
          success: false,
          error: "Cannot place robot at position 5,6 - position is invalid",
        };
      });

      const placeCommand = new PlaceCommand(5, 6, mockDirection);
      placeCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: false });
    });

    it("should create error message with correct coordinates", () => {
      const mockRobot = {} as Robot;
      const mockDirection = Direction.WEST;

      vi.mocked(Position).mockImplementation(() => ({} as any));
      vi.mocked(RobotActionFactory.createPlaceAction).mockReturnValue(
        {} as any
      );
      vi.mocked(BaseCommand.execute).mockReturnValue({ success: false });

      const placeCommand = new PlaceCommand(7, 8, mockDirection);
      placeCommand.execute(mockRobot);

      expect(BaseCommand.execute).toHaveBeenCalledWith(
        mockRobot,
        expect.any(Function),
        "Cannot place robot at position 7,8 - position is invalid",
        false
      );
    });

    it("should pass requiresPlacement as false to BaseCommand", () => {
      const mockRobot = {} as Robot;
      const mockDirection = Direction.NORTH;

      vi.mocked(Position).mockImplementation(() => ({} as any));
      vi.mocked(RobotActionFactory.createPlaceAction).mockReturnValue(
        {} as any
      );
      vi.mocked(BaseCommand.execute).mockReturnValue({ success: true });

      const placeCommand = new PlaceCommand(0, 0, mockDirection);
      placeCommand.execute(mockRobot);

      expect(BaseCommand.execute).toHaveBeenCalledWith(
        mockRobot,
        expect.any(Function),
        expect.any(String),
        false
      );
    });
  });
});
