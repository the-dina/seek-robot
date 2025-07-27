import { BaseCommand } from "src/application/commands/BaseCommand";
import { ICommand } from "src/application/commands/ICommand";
import { Robot } from "src/domain/Robot";
import { RobotReporter } from "src/domain/robot/RobotReporter";
import { ICommandResult } from "src/types";

export class ReportCommand implements ICommand {
  private readonly reporter: RobotReporter;

  constructor() {
    this.reporter = new RobotReporter();
  }

  execute(robot: Robot): ICommandResult {
    return BaseCommand.execute(
      robot,
      (r) => {
        const report = this.reporter.generateReport(r);
        return {
          success: !!report,
          ...(report && { output: report }),
        };
      },
      "Cannot generate report - robot state is invalid"
    );
  }
}
