import { Robot } from "src/domain/Robot";

export class RobotReporter {
  generateReport(robot: Robot): string | null {
    if (!robot.isPlaced) {
      return null;
    }
    return `${robot.position!.x},${robot.position!.y},${robot.direction}`;
  }
}
