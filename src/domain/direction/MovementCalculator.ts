import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";

export class MovementCalculator {
  static calculateNextCoordinates(
    currentPosition: Position,
    direction: Direction
  ): { x: number; y: number } {
    switch (direction) {
      case Direction.NORTH:
        return { x: currentPosition.x, y: currentPosition.y + 1 };
      case Direction.SOUTH:
        return { x: currentPosition.x, y: currentPosition.y - 1 };
      case Direction.EAST:
        return { x: currentPosition.x + 1, y: currentPosition.y };
      case Direction.WEST:
        return { x: currentPosition.x - 1, y: currentPosition.y };
      default:
        throw new Error(`Unknown direction: ${direction}`);
    }
  }
}
