import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import { IRobotAction } from "src/domain/robot/actions/IRobotAction";
import { MoveAction } from "src/domain/robot/actions/MoveAction";
import { PlaceAction } from "src/domain/robot/actions/PlaceAction";
import { RotateLeftAction } from "src/domain/robot/actions/RotateLeftAction";
import { RotateRightAction } from "src/domain/robot/actions/RotateRightAction";

export class RobotActionFactory {
  static createMoveAction(): IRobotAction {
    return new MoveAction();
  }

  static createRotateLeftAction(): IRobotAction {
    return new RotateLeftAction();
  }

  static createRotateRightAction(): IRobotAction {
    return new RotateRightAction();
  }

  static createPlaceAction(
    position: Position,
    direction: Direction
  ): IRobotAction {
    return new PlaceAction(position, direction);
  }
}
