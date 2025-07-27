import { Table } from "src/domain/Table";

export interface ITableBoundsCoordinateValidator {
  isValidCoordinates(x: number, y: number): boolean;
}

export class TableBoundsCoordinateValidator
  implements ITableBoundsCoordinateValidator
{
  constructor(private readonly table: Table) {}

  isValidCoordinates(x: number, y: number): boolean {
    return x >= 0 && x < this.table.width && y >= 0 && y < this.table.height;
  }
}
