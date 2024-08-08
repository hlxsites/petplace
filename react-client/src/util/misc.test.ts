import { createNumericArray, safeIdFromText } from "./misc";

describe("misc", () => {
  describe("safeIdFromText", () => {
    it("should replace spaces and tabs with dashes", () => {
      const text = "hello world";
      const expected = "hello-world";
      expect(safeIdFromText(text)).toEqual(expected);
    });

    it("should remove special characters", () => {
      const text = 'hello!@#$%^&*()_+{}|:"<>?`~world';
      const expected = "helloworld";
      expect(safeIdFromText(text)).toEqual(expected);
    });

    it("should convert text to lowercase", () => {
      const text = "HelloWorld";
      const expected = "helloworld";
      expect(safeIdFromText(text)).toEqual(expected);
    });

    it("should handle empty string", () => {
      const text = "";
      const expected = "";
      expect(safeIdFromText(text)).toEqual(expected);
    });
  });

  describe("numericListUntilNumber", () => {
    it.each([
      [5, [0, 1, 2, 3, 4]],
      [10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    ])(`should return an array of numbers from 0 to %i`, (input, expected) => {
      expect(createNumericArray(input)).toStrictEqual(expected);
    });
  });
});
