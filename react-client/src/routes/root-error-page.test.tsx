import { render, screen, fireEvent } from "@testing-library/react";
import {
  isRouteErrorResponse,
  MemoryRouter,
  useRouteError,
  useNavigate,
} from "react-router-dom";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { RootErrorPage } from "./root-error-page";

// Mock all required dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteError: jest.fn(),
  isRouteErrorResponse: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("~/infrastructure/telemetry/logUtils", () => ({
  logError: jest.fn(),
}));

// Mock Rollbar component to prevent actual error reporting
jest.mock("@rollbar/react", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
  LEVEL_ERROR: "error",
}));

const mockedUseRouteError = useRouteError as jest.MockedFunction<
  typeof useRouteError
>;
const mockedIsRouteErrorResponse = isRouteErrorResponse as jest.MockedFunction<
  typeof isRouteErrorResponse
>;
const mockedLogError = logError as jest.MockedFunction<typeof logError>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<
  typeof useNavigate
>;

describe("RootErrorPage", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigate.mockReturnValue(mockNavigate);
    Object.defineProperty(window, "location", {
      value: { pathname: "/test/path" },
      writable: true,
    });
  });

  it("should render error page with correct content", () => {
    mockedUseRouteError.mockReturnValue(new Error("Test error"));
    mockedIsRouteErrorResponse.mockReturnValue(false);

    const { container } = getRenderer();

    expect(screen.getByText("Oops! Something went wrong.")).toBeInTheDocument();
    expect(
      screen.getByText(/The page you requested could not be loaded/)
    ).toBeInTheDocument();
    expect(screen.getByText("Back Home")).toBeInTheDocument();
    expect(screen.getByText("Reload Page")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument(); // Check if icon is rendered
  });

  it("should log route error correctly", () => {
    const routeError = {
      status: 404,
      statusText: "Not Found",
      data: { message: "Page not found" },
    };
    mockedUseRouteError.mockReturnValue(routeError);
    mockedIsRouteErrorResponse.mockReturnValue(true);

    getRenderer();

    expect(mockedLogError).toHaveBeenCalledWith("Route error: 404 Not Found", {
      message: "Page not found",
    });
  });

  it("should log uncaught error correctly", () => {
    const error = new Error("Test error");
    mockedUseRouteError.mockReturnValue(error);
    mockedIsRouteErrorResponse.mockReturnValue(false);

    getRenderer();

    expect(mockedLogError).toHaveBeenCalledWith("Uncaught route error", error);
  });

  it("should log unknown error correctly", () => {
    const unknownError = { message: "Unknown error" };
    mockedUseRouteError.mockReturnValue(unknownError);
    mockedIsRouteErrorResponse.mockReturnValue(false);

    getRenderer();

    expect(mockedLogError).toHaveBeenCalledWith(
      "Unknown route error",
      unknownError
    );
  });

  it("should navigate to parent path when reloading a route error", () => {
    const routeError = {
      status: 404,
      statusText: "Not Found",
      data: {},
    };
    mockedUseRouteError.mockReturnValue(routeError);
    mockedIsRouteErrorResponse.mockReturnValue(true);

    const { getByText } = getRenderer();

    fireEvent.click(getByText("Reload Page"));

    expect(mockNavigate).toHaveBeenCalledWith("/test");
  });

  it("should navigate to current path when reloading a non-route error", () => {
    const error = new Error("Test error");
    mockedUseRouteError.mockReturnValue(error);
    mockedIsRouteErrorResponse.mockReturnValue(false);

    const { getByText } = getRenderer();

    fireEvent.click(getByText("Reload Page"));

    expect(mockNavigate).toHaveBeenCalledWith("/test/path");
  });
});

function getRenderer() {
  return render(
    <MemoryRouter>
      <RootErrorPage />
    </MemoryRouter>
  );
}
