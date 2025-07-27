import { Robot } from "src/domain/Robot";
import { ICommandResult } from "src/types";

export interface ICommand {
  execute(robot: Robot): ICommandResult;
}
