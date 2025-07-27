import { DirectionOperationFactory } from "src/domain/direction/operations/DirectionOperationFactory";
import { RotateLeftOperation } from "src/domain/direction/operations/RotateLeftOperation";
import { RotateRightOperation } from "src/domain/direction/operations/RotateRightOperation";
import { describe, expect, it } from "vitest";

describe("DirectionOperationFactory", () => {
  it("should create RotateLeftOperation instance", () => {
    const operation = DirectionOperationFactory.createRotateLeftOperation();

    expect(operation).toBeInstanceOf(RotateLeftOperation);
  });

  it("should create RotateRightOperation instance", () => {
    const operation = DirectionOperationFactory.createRotateRightOperation();

    expect(operation).toBeInstanceOf(RotateRightOperation);
  });

  it("should create new instances on each call", () => {
    const operation1 = DirectionOperationFactory.createRotateLeftOperation();
    const operation2 = DirectionOperationFactory.createRotateLeftOperation();

    expect(operation1).not.toBe(operation2);
  });

  it("should return objects implementing IDirectionOperation interface", () => {
    const leftOperation = DirectionOperationFactory.createRotateLeftOperation();
    const rightOperation =
      DirectionOperationFactory.createRotateRightOperation();

    expect(typeof leftOperation.execute).toBe("function");
    expect(typeof rightOperation.execute).toBe("function");
  });
});
