import { Direction } from "src/domain/Direction";
import { Position } from "src/domain/Position";
import type { IRobotAction } from "src/domain/robot/actions";
import { Table } from "src/domain/Table";

export class Robot {
  private _position: Position | null = null;
  private _direction: Direction | null = null;

  constructor(public readonly table: Table) {}

  get position(): Position | null {
    return this._position;
  }

  get direction(): Direction | null {
    return this._direction;
  }

  get isPlaced(): boolean {
    return this._position !== null && this._direction !== null;
  }

  setPosition(position: Position): void {
    this._position = position;
  }

  setDirection(direction: Direction): void {
    this._direction = direction;
  }

  executeAction(action: IRobotAction): boolean {
    return action.execute(this);
  }
}
