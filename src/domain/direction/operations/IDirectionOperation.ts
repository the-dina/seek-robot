import { Direction } from "src/domain/Direction";

export interface IDirectionOperation {
  execute(direction: Direction): Direction;
}
