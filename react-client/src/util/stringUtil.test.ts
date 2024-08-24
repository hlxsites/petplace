import {
  formatPrice,
  getValueFromPrice,
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

    it.each([0, []])(
      "should return one when zero in not available",
      (countFrom) => {
        expect(plural({ countFrom, ...DEFAULT_VALUES, zero: undefined })).toBe(
          DEFAULT_VALUES.one
        );
      }
    );
  });

  describe("getValueFromPrice", () => {
    it("should convert price string to number", () => {
      const price = getValueFromPrice("$19.95");
      expect(price).toBe(19.95);
    });

    it("should handle prices with commas", () => {
      const price = getValueFromPrice("$1,999.99");
      expect(price).toBe(1999.99);
    });

    it.each([
      ["R$ 66.99", 66.99],
      ["€ 11.22", 11.22],
    ])("should handle prices in other currencies", (price, expected) => {
      const value = getValueFromPrice(price);
      expect(value).toBe(expected);
    });

    it("should return 0 for invalid format", () => {
      const price = getValueFromPrice("Abc");
      expect(price).toBe(0);
    });
  });

  describe("formatPrice", () => {
    it("should format number with two decimal places", () => {
      const price = formatPrice(19.9);
      expect(price).toBe("19.90");
    });

    it("should keep two decimals even if they are zeros", () => {
      const price = formatPrice(20);
      expect(price).toBe("20.00");
    });

    it('should round numbers to two decimal places', () => {
      const price = formatPrice(19.999);
      expect(price).toBe('20.00');
    });
  });
});
