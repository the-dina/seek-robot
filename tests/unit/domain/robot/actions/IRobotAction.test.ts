import { IRobotAction } from "src/domain/robot/actions/IRobotAction";
import { describe, expect, it } from "vitest";

describe("IRobotAction", () => {
  it("should define execute method signature", () => {
    const mockAction: IRobotAction = {
      execute: (robot: any) => true,
    };

    expect(typeof mockAction.execute).toBe("function");
    expect(mockAction.execute({})).toBe(true);
  });

  it("should accept robot parameter and return boolean", () => {
    const mockAction: IRobotAction = {
      execute: (robot: any) => false,
    };

    const result = mockAction.execute({ someProperty: "value" });

    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("should allow different return values", () => {
    const successAction: IRobotAction = {
      execute: () => true,
    };

    const failAction: IRobotAction = {
      execute: () => false,
    };

    expect(successAction.execute({})).toBe(true);
    expect(failAction.execute({})).toBe(false);
  });
});
