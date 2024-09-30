import { render } from "@testing-library/react";
import {
  isRouteErrorResponse,
  MemoryRouter,
  useRouteError,
} from "react-router-dom";
import { logError } from "~/infrastructure/telemetry/logUtils"; // Import the logError function
import { RootErrorPage } from "./root-error-page";

jest.mock("react-router-dom", () => ({
  useRouteError: jest.fn(),
  isRouteErrorResponse: jest.fn(),
}));

jest.mock("~/infrastructure/telemetry/logUtils", () => ({
  logError: jest.fn(),
}));

const mockedUseRouteError = useRouteError as jest.MockedFunction<
  typeof useRouteError
>;
const mockedIsRouteErrorResponse = isRouteErrorResponse as jest.MockedFunction<
  typeof isRouteErrorResponse
>;
const mockedLogError = logError as jest.MockedFunction<typeof logError>;

// TODO: find a way to run those tests
describe.skip("RootErrorPage.", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render nothing when there is no error", () => {
    mockedUseRouteError.mockReturnValue(null);

    const { container } = getRenderer();

    expect(container.firstChild).toBeNull();
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

function getRenderer() {
  return render(
    <MemoryRouter>
      <RootErrorPage />
    </MemoryRouter>
  );
}
