import { BaseCommand } from "src/application/commands/BaseCommand";
import { ICommand } from "src/application/commands/ICommand";
import { Robot } from "src/domain/Robot";
import { RobotActionFactory } from "src/domain/robot/actions";
import { ICommandResult } from "src/types";

export class LeftCommand implements ICommand {
  execute(robot: Robot): ICommandResult {
    return BaseCommand.execute(
      robot,
      (r) => ({
        success: r.executeAction(RobotActionFactory.createRotateLeftAction()),
      }),
      "Cannot rotate robot left"
    );
  }
}
