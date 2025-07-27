import { ICommand } from "src/application/commands/ICommand";
import { LeftCommand } from "src/application/commands/LeftCommand";
import { MoveCommand } from "src/application/commands/MoveCommand";
import { ReportCommand } from "src/application/commands/ReportCommand";
import { RightCommand } from "src/application/commands/RightCommand";
import { PlaceCommandParser } from "src/application/parsers";

export class CommandParser {
  private placeCommandParser = new PlaceCommandParser();

  parseCommand(commandString: string): ICommand | null {
    const trimmedCommand = commandString.trim().toUpperCase();

    if (!trimmedCommand) {
      return null;
    }

    if (trimmedCommand.startsWith("PLACE ")) {
      return this.placeCommandParser.parse(trimmedCommand);
    }

    switch (trimmedCommand) {
      case "MOVE":
        return new MoveCommand();
      case "LEFT":
        return new LeftCommand();
      case "RIGHT":
        return new RightCommand();
      case "REPORT":
        return new ReportCommand();
      default:
        return null;
    }
  }

  isValidCommand(commandString: string): boolean {
    return this.parseCommand(commandString) !== null;
  }
}
