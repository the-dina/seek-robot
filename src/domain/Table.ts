import {
  DimensionValidator,
  IntegerValidator,
  PositiveValidator,
} from "src/domain/validation/numeric";

export class Table {
  private static readonly dimensionValidator = new DimensionValidator(
    new IntegerValidator(),
    new PositiveValidator()
  );

  constructor(public readonly width: number, public readonly height: number) {
    Table.dimensionValidator.validateDimension(width, "table width");
    Table.dimensionValidator.validateDimension(height, "table height");
  }
}
