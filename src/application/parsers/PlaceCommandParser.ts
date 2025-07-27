import { PlaceCommand } from "src/application/commands/PlaceCommand";
import { DirectionParser } from "src/domain/direction/DirectionParser";

export class PlaceCommandParser {
  parse(commandString: string): PlaceCommand | null {
    const placeMatch = commandString.match(/^PLACE\s+(\d+),(\d+),([A-Z]+)$/);

    if (!placeMatch) {
      return null;
    }

    const [, xStr, yStr, directionStr] = placeMatch;

    try {
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      const direction = DirectionParser.fromString(directionStr);

      return new PlaceCommand(x, y, direction);
    } catch (error) {
      return null;
    }
  }
}
