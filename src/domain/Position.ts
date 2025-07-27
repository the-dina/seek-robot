import {
  CoordinateValidator,
  IntegerValidator,
  NonNegativeValidator,
} from "src/domain/validation/numeric";

export class Position {
  private static readonly coordinateValidator = new CoordinateValidator(
    new IntegerValidator(),
    new NonNegativeValidator()
  );

  constructor(public readonly x: number, public readonly y: number) {
    Position.coordinateValidator.validateCoordinate(x, "x coordinate");
    Position.coordinateValidator.validateCoordinate(y, "y coordinate");
  }
}
