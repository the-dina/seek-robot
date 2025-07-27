import { Position } from "src/domain/Position";
import { Table } from "src/domain/Table";

export interface ITableBoundsPositionValidator {
  isValidPosition(position: Position): boolean;
}

export class TableBoundsPositionValidator
  implements ITableBoundsPositionValidator
{
  constructor(private readonly table: Table) {}

  isValidPosition(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.table.width &&
      position.y >= 0 &&
      position.y < this.table.height
    );
  }
}
