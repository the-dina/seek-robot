import { Robot } from "src/domain/Robot";
import { ICommandResult } from "src/types";

export type CommandExecutor = (robot: Robot) => {
  success: boolean;
  output?: string;
};

export class BaseCommand {
  static execute(
    robot: Robot,
    executor: CommandExecutor,
    errorMessage: string,
    requiresPlacement: boolean = true
  ): ICommandResult {
    if (requiresPlacement && !robot.isPlaced) {
      return {
        success: false,
        error: "Robot is not placed on the table",
      };
    }

    const result = executor(robot);

    if (result.success) {
      return {
        success: true,
        ...(result.output && { output: result.output }),
      };
    } else {
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
