import { parseDate, parseDateTime, parseDateToFormat } from "./dateUtils";

describe("dateUtils", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("parseDate", () => {
    it("should parse an ISO string to a locale date string", () => {
      const isoDate = "2021-03-01T12:34:56Z";
      const expectedResult = new Date(isoDate).toLocaleDateString();
      expect(parseDate(isoDate)).toBe(expectedResult);
    });

    it("should return an empty string for undefined", () => {
      expect(parseDate()).toBe("");
    });
  });

  describe("parseDateTime", () => {
    it("should parse an ISO string to a locale date and time string", () => {
      const isoDate = "2021-03-01T12:34:56Z";
      const dateObject = new Date(isoDate);
      const expectedResult = `${dateObject.toLocaleDateString()} ${dateObject.toTimeString().slice(0, 8)}`;
      expect(parseDateTime(isoDate)).toBe(expectedResult);
    });

    it("should return an empty string for undefined", () => {
      expect(parseDateTime()).toBe("");
    });
  });

  describe("parseDateToFormat", () => {
    it('should format a string date to "MM/dd/yyyy" format by default', () => {
      const isoDate = "2021-03-01T12:34:56Z";
      const expectedResult = "03/01/2021";
      expect(parseDateToFormat(isoDate)).toBe(expectedResult);
    });

    it.each([
      ["dd/MM/yyyy", "01/03/2021"],
      ["MMMM", "March"],
    ])(
      'should format a Date object to "MM/dd/yyyy" format',
      (format, expected) => {
        const isoDate = "2021-03-01T12:34:56Z";
        expect(parseDateToFormat(isoDate, format)).toBe(expected);
      }
    );

    it('should format a Date object to "MM/dd/yyyy" format by default', () => {
      const date = new Date("2021-03-01T12:34:56Z");
      const expectedResult = "03/01/2021";
      expect(parseDateToFormat(date)).toBe(expectedResult);
    });

    it.each([
      ["dd/MM/yyyy", "01/03/2021"],
      ["MMMM", "March"],
    ])(
      'should format a Date object to "MM/dd/yyyy" format',
      (format, expected) => {
        const sampleDate = new Date("2021-03-01T12:34:56Z");
        expect(parseDateToFormat(sampleDate, format)).toBe(expected);
      }
    );

    it("should return an empty string for invalid date strings", () => {
      const invalidDate = "not-a-date";
      expect(parseDateToFormat(invalidDate)).toBe("");
    });

    it("should return an empty string for an invalid date object", () => {
      const invalidDate = new Date("");
      expect(parseDateToFormat(invalidDate)).toBe("");
    });

    it("should format date with custom format including time and timezone", () => {
      const isoDate = "2021-03-01T12:34:56Z";
      const format = "MM/dd/yyyy HH:mm:ssXXX";
      const expected = "03/01/2021 12:34:56Z";
      expect(parseDateToFormat(isoDate, format)).toBe(expected);
    });
  });
});
