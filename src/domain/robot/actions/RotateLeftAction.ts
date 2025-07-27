import { DirectionOperationFactory } from "src/domain/direction/operations";
import { Robot } from "src/domain/Robot";
import { IRobotAction } from "src/domain/robot/actions/IRobotAction";

export class RotateLeftAction implements IRobotAction {
  execute(robot: Robot): boolean {
    if (!robot.isPlaced) {
      return false;
    }
    const rotateOperation =
      DirectionOperationFactory.createRotateLeftOperation();
    robot.setDirection(rotateOperation.execute(robot.direction!));
    return true;
  }
}
