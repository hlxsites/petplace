import { plural } from "./stringUtil";

describe("plural", () => {
  const DEFAULT_VALUES = {
    zero: "No results",
    one: "One result",
    other: "Many results",
  };

  it.each([0, []])("should return zero", (countFrom) => {
    expect(plural({ countFrom, ...DEFAULT_VALUES })).toBe(DEFAULT_VALUES.zero);
  });

  it.each([1, [{}]])("should return one", (countFrom) => {
    expect(plural({ countFrom, ...DEFAULT_VALUES })).toBe(DEFAULT_VALUES.one);
  });

  it.each([53, ["", ""]])("should return other", (countFrom) => {
    expect(plural({ countFrom, ...DEFAULT_VALUES })).toBe(DEFAULT_VALUES.other);
  });
});
