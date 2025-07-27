import { BaseCommand } from "src/application/commands/BaseCommand";
import { LeftCommand } from "src/application/commands/LeftCommand";
import { RobotActionFactory } from "src/domain/robot/actions";
import { describe, expect, it, vi } from "vitest";

vi.mock("src/application/commands/BaseCommand");
vi.mock("src/domain/robot/actions");

describe("LeftCommand", () => {
  describe("execute", () => {
    it("should call BaseCommand.execute with correct parameters for successful rotation", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockAction = {};
      const mockResult = { success: true };

      vi.mocked(RobotActionFactory.createRotateLeftAction).mockReturnValue(
        mockAction as any
      );
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        // Call the executor to trigger the action factory call
        executor(robot);
        return mockResult;
      });

      const leftCommand = new LeftCommand();
      const result = leftCommand.execute(mockRobot);

      expect(RobotActionFactory.createRotateLeftAction).toHaveBeenCalled();
      expect(BaseCommand.execute).toHaveBeenCalledWith(
        mockRobot,
        expect.any(Function),
        "Cannot rotate robot left"
      );
      expect(result).toBe(mockResult);
    });

    it("should pass executor function that calls robot.executeAction with rotate left action", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(true),
      } as any;
      const mockAction = {};

      vi.mocked(RobotActionFactory.createRotateLeftAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return { success: true };
      });

      const leftCommand = new LeftCommand();
      leftCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: true });
    });

    it("should handle robot action failure", () => {
      const mockRobot = {
        executeAction: vi.fn().mockReturnValue(false),
      } as any;
      const mockAction = {};

      vi.mocked(RobotActionFactory.createRotateLeftAction).mockReturnValue(
        mockAction as any
      );

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return { success: false, error: "Cannot rotate robot left" };
      });

      const leftCommand = new LeftCommand();
      leftCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockRobot.executeAction).toHaveBeenCalledWith(mockAction);
      expect(executorResult).toEqual({ success: false });
    });
  });
});
