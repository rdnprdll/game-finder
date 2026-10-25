import { describe, it, expect } from "vitest";
import { safeUrl, plainText } from "./safe";

describe("safeUrl", () => {
  it("allows https and http links", () => {
    expect(safeUrl("https://store.steampowered.com/app/1")).toBe("https://store.steampowered.com/app/1");
    expect(safeUrl("http://example.com/")).toBe("http://example.com/");
  });

  it("blocks dangerous or broken links", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl("data:text/html,hi")).toBeNull();
    expect(safeUrl("not a url")).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
  });
});

describe("plainText", () => {
  it("removes HTML tags", () => {
    expect(plainText("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("collapses extra whitespace", () => {
    expect(plainText("a   b \n\n c")).toBe("a b c");
  });

  it("handles empty values", () => {
    expect(plainText(null)).toBe("");
  });
});