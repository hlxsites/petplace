import {
  plural,
  upperCaseFirstLetter,
  upperCaseFirstLetterOfEachWord,
  upperCaseFirstLetterRestLowerCase,
} from "./stringUtil";

describe("stringUtil", () => {
  describe("upperCaseFirstLetter", () => {
    it.each([
      ["", ""],
      ["a", "A"],
      ["A", "A"],
      ["hello", "Hello"],
      ["hello world", "Hello world"],
      ["hello World", "Hello World"],
      ["hello_wORld", "Hello_wORld"],
      ["Lorem ipSUM DOlor", "Lorem ipSUM DOlor"],
    ])("when given %p should return %p", (input, expected) => {
      expect(upperCaseFirstLetter(input)).toBe(expected);
    });
  });

  describe("upperCaseFirstLetterRestLowerCase", () => {
    it.each([
      ["", ""],
      ["a", "A"],
      ["A", "A"],
      ["hello", "Hello"],
      ["hello world", "Hello world"],
      ["hello_wORld", "Hello_world"],
      ["Lorem ipSUM DOlor", "Lorem ipsum dolor"],
    ])("when given %p should return %p", (input, expected) => {
      expect(upperCaseFirstLetterRestLowerCase(input)).toBe(expected);
    });
  });

  describe("upperCaseFirstLetterOfEachWord", () => {
    it.each([
      ["", ""],
      ["a", "A"],
      ["A", "A"],
      ["hello", "Hello"],
      ["hello world", "Hello World"],
      ["hello_wORld", "Hello_world"],
      ["Lorem ipSUM DOlor", "Lorem Ipsum Dolor"],
    ])("when given %p should return %p", (input, expected) => {
      expect(upperCaseFirstLetterOfEachWord(input)).toBe(expected);
    });
  });

  describe("plural", () => {
    const DEFAULT_VALUES = {
      zero: "No results",
      one: "One result",
      other: "Many results",
    };

    it.each([0, []])("should return zero", (countFrom) => {
      expect(plural({ countFrom, ...DEFAULT_VALUES })).toBe(
        DEFAULT_VALUES.zero
      );
    });

    it.each([1, [{}]])("should return one", (countFrom) => {
      expect(plural({ countFrom, ...DEFAULT_VALUES })).toBe(DEFAULT_VALUES.one);
    });

    it.each([53, ["", ""]])("should return other", (countFrom) => {
      expect(plural({ countFrom, ...DEFAULT_VALUES })).toBe(
        DEFAULT_VALUES.other
      );
    });

    it.each([53, ["", ""]])("should return other", (countFrom) => {
      expect(plural({ countFrom, ...DEFAULT_VALUES })).toBe(
        DEFAULT_VALUES.other
      );
    });

    it.each([0, []])("should return one when zero in not available", (countFrom) => {
      expect(plural({ countFrom, ...DEFAULT_VALUES, zero: undefined })).toBe(
        DEFAULT_VALUES.one
      );
    });
  });
});
