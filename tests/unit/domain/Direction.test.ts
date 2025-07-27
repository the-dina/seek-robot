import { Direction } from "src/domain/Direction";
import { describe, expect, it } from "vitest";

describe("Direction", () => {
  it("should have correct enum values", () => {
    expect(Direction.NORTH).toBe("NORTH");
    expect(Direction.SOUTH).toBe("SOUTH");
    expect(Direction.EAST).toBe("EAST");
    expect(Direction.WEST).toBe("WEST");
  });

  it("should have exactly 4 direction values", () => {
    const values = Object.values(Direction);
    expect(values).toHaveLength(4);
  });

  it("should be accessible via string keys", () => {
    expect(Direction["NORTH"]).toBe("NORTH");
    expect(Direction["SOUTH"]).toBe("SOUTH");
    expect(Direction["EAST"]).toBe("EAST");
    expect(Direction["WEST"]).toBe("WEST");
  });
});
