import { logError, logWarning } from "./loggerUtils";
import Rollbar from "rollbar";

// Mock Rollbar methods
jest.mock("rollbar");

const mockRollbar = Rollbar as jest.Mocked<typeof Rollbar>;

describe("logError and logWarning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("logError", () => {
    it("should call rollbar.error with the correct message and error", () => {
      const mockError = new Error("Test error");
      logError("Error occurred", mockError);

      expect(mockRollbar.prototype.error).toHaveBeenCalledWith(
        "Error occurred",
        mockError
      );
    });

    it("should handle non-error objects as error and log", () => {
      const errorObj = { message: "Not an error" };
      logError("A non-error occurred", errorObj);

      expect(mockRollbar.prototype.error).toHaveBeenCalledWith(
        "A non-error occurred",
        new Error("[object Object]")
      );
    });

    it("should log error even if no error is passed", () => {
      logError("An unknown error occurred");

      expect(mockRollbar.prototype.error).toHaveBeenCalledWith(
        "An unknown error occurred",
        new Error("undefined")
      );
    });
  });

  describe("logWarning", () => {
    it("should call rollbar.warning with the correct message and error", () => {
      const mockError = new Error("Test warning");
      logWarning("Warning occurred", mockError);

      expect(mockRollbar.prototype.warning).toHaveBeenCalledWith(
        "Warning occurred",
        mockError
      );
    });

    it("should handle non-error objects as warning and log", () => {
      const warningObj = { message: "Not a warning" };
      logWarning("A non-warning occurred", warningObj);

      expect(mockRollbar.prototype.warning).toHaveBeenCalledWith(
        "A non-warning occurred",
        new Error("[object Object]")
      );
    });

    it("should log warning even if no warning is passed", () => {
      logWarning("An unknown warning occurred");

      expect(mockRollbar.prototype.warning).toHaveBeenCalledWith(
        "An unknown warning occurred",
        new Error("undefined")
      );
    });
  });
});
