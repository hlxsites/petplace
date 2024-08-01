import {
  upperCaseFirstLetter,
  upperCaseFirstLetterOfEachWord,
  upperCaseFirstLetterRestLowerCase,
} from "./stringUtils";

describe("stringUtils", () => {
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
    ])("when given %s should return %s", (input, expected) => {
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
    ])("when given %s should return %s", (input, expected) => {
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
    ])("when given %s should return %s", (input, expected) => {
      expect(upperCaseFirstLetterOfEachWord(input)).toBe(expected);
    });
  });
});
