import { describe, it, expect } from "vitest";
import { parseJson } from "./ai";

describe("parseJson", () => {
  it("parses plain JSON", () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("pulls JSON out of extra text", () => {
    expect(parseJson('Sure! {"a":1} hope that helps')).toEqual({ a: 1 });
  });

  it("handles code fences", () => {
    expect(parseJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("throws when there is no JSON", () => {
    expect(() => parseJson("no json here")).toThrow();
  });

  it("throws on broken JSON", () => {
    expect(() => parseJson("{a: nope}")).toThrow();
  });
});