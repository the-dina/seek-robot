import { IDirectionOperation } from "src/domain/direction/operations/IDirectionOperation";
import { RotateLeftOperation } from "src/domain/direction/operations/RotateLeftOperation";
import { RotateRightOperation } from "src/domain/direction/operations/RotateRightOperation";

export class DirectionOperationFactory {
  static createRotateLeftOperation(): IDirectionOperation {
    return new RotateLeftOperation();
  }

  static createRotateRightOperation(): IDirectionOperation {
    return new RotateRightOperation();
  }
}
