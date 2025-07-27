import { BaseCommand } from "src/application/commands/BaseCommand";
import { ReportCommand } from "src/application/commands/ReportCommand";
import { Robot } from "src/domain/Robot";
import { RobotReporter } from "src/domain/robot/RobotReporter";
import { describe, expect, it, vi } from "vitest";

vi.mock("src/application/commands/BaseCommand");
vi.mock("src/domain/robot/RobotReporter");

describe("ReportCommand", () => {
  describe("execute", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should call BaseCommand.execute with correct parameters for successful report", () => {
      const mockRobot = {} as Robot;
      const mockReporter = {
        generateReport: vi.fn().mockReturnValue("1,2,NORTH"),
      };
      const mockResult = { success: true, output: "1,2,NORTH" };

      vi.mocked(RobotReporter).mockImplementation(() => mockReporter as any);
      vi.mocked(BaseCommand.execute).mockReturnValue(mockResult);

      const reportCommand = new ReportCommand();
      const result = reportCommand.execute(mockRobot);

      expect(BaseCommand.execute).toHaveBeenCalledWith(
        mockRobot,
        expect.any(Function),
        "Cannot generate report - robot state is invalid"
      );
      expect(result).toBe(mockResult);
    });

    it("should pass executor function that calls reporter.generateReport and returns success with output", () => {
      const mockRobot = {} as Robot;
      const mockReporter = {
        generateReport: vi.fn().mockReturnValue("3,4,SOUTH"),
      };

      vi.mocked(RobotReporter).mockImplementation(() => mockReporter as any);

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return { success: true, output: "3,4,SOUTH" };
      });

      const reportCommand = new ReportCommand();
      reportCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockReporter.generateReport).toHaveBeenCalledWith(mockRobot);
      expect(executorResult).toEqual({
        success: true,
        output: "3,4,SOUTH",
      });
    });

    it("should handle null report from reporter", () => {
      const mockRobot = {} as Robot;
      const mockReporter = {
        generateReport: vi.fn().mockReturnValue(null),
      };

      vi.mocked(RobotReporter).mockImplementation(() => mockReporter as any);

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return {
          success: false,
          error: "Cannot generate report - robot state is invalid",
        };
      });

      const reportCommand = new ReportCommand();
      reportCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockReporter.generateReport).toHaveBeenCalledWith(mockRobot);
      expect(executorResult).toEqual({ success: false });
    });

    it("should handle empty string report from reporter", () => {
      const mockRobot = {} as Robot;
      const mockReporter = {
        generateReport: vi.fn().mockReturnValue(""),
      };

      vi.mocked(RobotReporter).mockImplementation(() => mockReporter as any);

      let capturedExecutor: any;
      vi.mocked(BaseCommand.execute).mockImplementation((robot, executor) => {
        capturedExecutor = executor;
        return {
          success: false,
          error: "Cannot generate report - robot state is invalid",
        };
      });

      const reportCommand = new ReportCommand();
      reportCommand.execute(mockRobot);

      const executorResult = capturedExecutor(mockRobot);

      expect(mockReporter.generateReport).toHaveBeenCalledWith(mockRobot);
      expect(executorResult).toEqual({ success: false });
    });

    it("should create RobotReporter instance in constructor", () => {
      vi.clearAllMocks();

      new ReportCommand();

      expect(RobotReporter).toHaveBeenCalledTimes(1);
    });
  });
});
