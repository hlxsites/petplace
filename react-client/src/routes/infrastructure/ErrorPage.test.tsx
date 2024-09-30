import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorPage } from "./ErrorPage";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { logError } from "./utils/loggerUtils"; // Import the logError function

jest.mock("react-router-dom", () => ({
  useRouteError: jest.fn(),
  isRouteErrorResponse: jest.fn(),
}));

jest.mock("./utils/loggerUtils", () => ({
  logError: jest.fn(),
}));

jest.mock("~/routes/root-error-page", () => ({
  RootErrorPage: () => <div data-testid="root-error-page">Root Error Page</div>,
}));

const mockedUseRouteError = useRouteError as jest.MockedFunction<
  typeof useRouteError
>;
const mockedIsRouteErrorResponse = isRouteErrorResponse as jest.MockedFunction<
  typeof isRouteErrorResponse
>;
const mockedLogError = logError as jest.MockedFunction<typeof logError>;

describe("ErrorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render nothing when there is no error", () => {
    mockedUseRouteError.mockReturnValue(null);

    const { container } = getRenderer();

    expect(container.firstChild).toBeNull();
  });

  it("should render RootErrorPage when there is an error and no fallback", () => {
    mockedUseRouteError.mockReturnValue(new Error("Test error"));

    getRenderer();

    expect(screen.getByTestId("root-error-page")).toBeInTheDocument();
  });

  it("should render fallback component when provided and there is an error", () => {
    mockedUseRouteError.mockReturnValue(new Error("Test error"));

    getRenderer({
      fallback: <div data-testid="custom-fallback">Custom Fallback</div>,
    });

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });

  it("should log route error using logError", () => {
    const routeError = { status: 404, statusText: "Not Found", data: {} };
    mockedUseRouteError.mockReturnValue(routeError);
    mockedIsRouteErrorResponse.mockReturnValue(true);

    getRenderer();

    expect(mockedLogError).toHaveBeenCalledWith(
      "Route Error: 404 Not Found",
      {}
    );
  });

  it("should log uncaught error using logError", () => {
    const error = new Error("Test error");
    mockedUseRouteError.mockReturnValue(error);
    mockedIsRouteErrorResponse.mockReturnValue(false);

    getRenderer();

    expect(mockedLogError).toHaveBeenCalledWith("Uncaught Error", error);
  });

  it("should log unknown error using logError", () => {
    const unknownError = { message: "Unknown error" };
    mockedUseRouteError.mockReturnValue(unknownError);
    mockedIsRouteErrorResponse.mockReturnValue(false);

    getRenderer();

    expect(mockedLogError).toHaveBeenCalledWith("Unknown Error", unknownError);
  });
});

function getRenderer(props: { fallback?: React.ReactNode } = {}) {
  return render(<ErrorPage {...props} />);
}
