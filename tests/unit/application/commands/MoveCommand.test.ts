import { BaseCommand } from "src/application/commands/BaseCommand";
import { MoveCommand } from "src/application/commands/MoveCommand";
import { RobotActionFactory } from "src/domain/robot/actions";
import { describe, expect, it, vi } from "vitest";

vi.mock("src/application/commands/BaseCommand");
vi.mock("src/domain/robot/actions");

describe("MoveCommand", () => {
  describe("execute", () => {
    it("should call BaseCommand.execute with correct parameters for successful move", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockAction = {};
      const mockResult = { success: true };

      vi.mocked(RobotActionFactory.createMoveAction).mockReturnValue(
        mockAction as any
      );
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        // Call the executor to trigger the action factory call
        executor(robot);
        return mockResult;
      });

      const moveCommand = new MoveCommand();
      const result = moveCommand.execute(mockRobot);

      expect(RobotActionFactory.createMoveAction).toHaveBeenCalled();
      expect(BaseCommand.execute).toHaveBeenCalledWith(
        mockRobot,
        expect.any(Function),
        "Cannot move robot - would fall off the table"
      );
      expect(result).toBe(mockResult);
    });

    it("should pass executor function that calls robot.executeAction with move action", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockAction = {};

      vi.mocked(RobotActionFactory.createMoveAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return { success: true };
      });

      const moveCommand = new MoveCommand();
      moveCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: true });
    });

    it("should handle robot action failure", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(false),
      } as any;
      const mockAction = {};

      vi.mocked(RobotActionFactory.createMoveAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return {
          success: false,
          error: "Cannot move robot - would fall off the table",
        };
      });

      const moveCommand = new MoveCommand();
      moveCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: false });
    });
  });
});
