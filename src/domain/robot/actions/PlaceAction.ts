import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { IRobotAction } from "src/domain/robot/actions/IRobotAction";
import { TableBoundsPositionValidator } from "src/domain/validation/table";

export class PlaceAction implements IRobotAction {
  constructor(
    private readonly position: Position,
    private readonly direction: Direction
  ) {}

  execute(robot: Robot): boolean {
    const positionValidator = new TableBoundsPositionValidator(robot.table);
    if (!positionValidator.isValidPosition(this.position)) {
      return false;
    }
    robot.setPosition(this.position);
    robot.setDirection(this.direction);
    return true;
  }
}
