import { Direction } from "src/domain/Direction";
import { DirectionStringValidator } from "src/domain/validation/direction";

export class DirectionParser {
  private static readonly validator = new DirectionStringValidator();

  static fromString(direction: string): Direction {
    const upperDirection = direction.toUpperCase();
    DirectionParser.validator.validateDirectionString(
      upperDirection,
      "direction"
    );
    return upperDirection as Direction;
  }
}
