import { describe, it, expect } from "vitest";
import { generateInvisibleText } from "./generator";

describe("generateInvisibleText", () => {
  it("should generate the requested number of characters", () => {
    expect(generateInvisibleText(5)).toHaveLength(5);
    expect(generateInvisibleText(1)).toHaveLength(1);
  });

  it("should use the Hangul Filler character (U+3164)", () => {
    const result = generateInvisibleText(1);
    expect(result).toBe("\u3164");
  });

  it("should clamp length to a minimum of 1", () => {
    expect(generateInvisibleText(0)).toHaveLength(1);
    expect(generateInvisibleText(-10)).toHaveLength(1);
  });

  it("should clamp length to a maximum of 10000", () => {
    expect(generateInvisibleText(20000)).toHaveLength(10000);
  });
});
