import { BaseCommand } from "src/application/commands/BaseCommand";
import { ICommand } from "src/application/commands/ICommand";
import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { RobotActionFactory } from "src/domain/robot/actions";
import { ICommandResult } from "src/types";

export class PlaceCommand implements ICommand {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly direction: Direction
  ) {}

  execute(robot: Robot): ICommandResult {
    const position = new Position(this.x, this.y);

    return BaseCommand.execute(
      robot,
      (r) => ({
        success: r.executeAction(
          RobotActionFactory.createPlaceAction(position, this.direction)
        ),
      }),
      `Cannot place robot at position ${this.x},${this.y} - position is invalid`,
      false
    );
  }
}
