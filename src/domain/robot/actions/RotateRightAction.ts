import { DirectionOperationFactory } from "src/domain/direction/operations";
import { Robot } from "src/domain/Robot";
import { IRobotAction } from "src/domain/robot/actions/IRobotAction";

export class RotateRightAction implements IRobotAction {
  execute(robot: Robot): boolean {
    if (!robot.isPlaced) {
      return false;
    }
    const rotateOperation =
      DirectionOperationFactory.createRotateRightOperation();
    robot.setDirection(rotateOperation.execute(robot.direction!));
    return true;
  }
}
