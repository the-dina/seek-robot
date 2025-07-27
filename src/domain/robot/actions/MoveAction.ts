import { MovementCalculator } from "src/domain/direction/MovementCalculator";
import { Position } from "src/domain/Position";
import { Robot } from "src/domain/Robot";
import { IRobotAction } from "src/domain/robot/actions/IRobotAction";
import { TableBoundsCoordinateValidator } from "src/domain/validation/table";

export class MoveAction implements IRobotAction {
  execute(robot: Robot): boolean {
    if (!robot.isPlaced) {
      return false;
    }
    const nextCoordinates = MovementCalculator.calculateNextCoordinates(
      robot.position!,
      robot.direction!
    );
    const coordinateValidator = new TableBoundsCoordinateValidator(robot.table);
    if (
      !coordinateValidator.isValidCoordinates(
        nextCoordinates.x,
        nextCoordinates.y
      )
    ) {
      return false;
    }
    robot.setPosition(new Position(nextCoordinates.x, nextCoordinates.y));
    return true;
  }
}
