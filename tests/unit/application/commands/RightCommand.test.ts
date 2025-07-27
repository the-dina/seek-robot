import { BaseCommand } from "src/application/commands/BaseCommand";
import { RightCommand } from "src/application/commands/RightCommand";
import { RobotActionFactory } from "src/domain/robot/actions";
import { describe, expect, it, vi } from "vitest";

vi.mock("src/application/commands/BaseCommand");
vi.mock("src/domain/robot/actions");

describe("RightCommand", () => {
  describe("execute", () => {
    it("should call BaseCommand.execute with correct parameters for successful rotation", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockAction = {};
      const mockResult = { success: true };

      vi.mocked(RobotActionFactory.createRotateRightAction).mockReturnValue(
        mockAction as any
      );
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        // Call the executor to trigger the action factory call
        executor(robot);
        return mockResult;
      });

      const rightCommand = new RightCommand();
      const result = rightCommand.execute(mockRobot);

      expect(RobotActionFactory.createRotateRightAction).toHaveBeenCalled();
      expect(BaseCommand.execute).toHaveBeenCalledWith(
        mockRobot,
        expect.any(Function),
        "Cannot rotate robot right"
      );
      expect(result).toBe(mockResult);
    });

    it("should pass executor function that calls robot.executeAction with rotate right action", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockAction = {};

      vi.mocked(RobotActionFactory.createRotateRightAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return { success: true };
      });

      const rightCommand = new RightCommand();
      rightCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: true });
    });

    it("should handle robot action failure", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(false),
      } as any;
      const mockAction = {};

      vi.mocked(RobotActionFactory.createRotateRightAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return { success: false, error: "Cannot rotate robot right" };
      });

      const rightCommand = new RightCommand();
      rightCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: false });
    });
  });
});
