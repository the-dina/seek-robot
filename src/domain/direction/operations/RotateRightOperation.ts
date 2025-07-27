import { Direction } from "src/domain/Direction";
import { IDirectionOperation } from "src/domain/direction/operations/IDirectionOperation";

export class RotateRightOperation implements IDirectionOperation {
  execute(direction: Direction): Direction {
    switch (direction) {
      case Direction.NORTH:
        return Direction.EAST;
      case Direction.EAST:
        return Direction.SOUTH;
      case Direction.SOUTH:
        return Direction.WEST;
      case Direction.WEST:
        return Direction.NORTH;
    }
  }
}
