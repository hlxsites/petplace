import { ErrorBoundary, LEVEL_ERROR } from "@rollbar/react";
import { ReactNode, useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { RootErrorPage } from "~/routes/root-error-page";
import { logError } from "./utils/loggerUtils";

type ErrorBoundaryProps = {
  fallback?: ReactNode;
};

export const ErrorPage = ({ fallback }: ErrorBoundaryProps) => {
  const error = useRouteError();

  useEffect(() => {
    if (error) {
      if (isRouteErrorResponse(error)) {
        logError(
          `Route Error: ${error.status} ${error.statusText}`,
          error.data
        );
      } else if (error instanceof Error) {
        logError("Uncaught Error", error);
      } else {
        logError("Unknown Error", error);
      }
    }
  }, [error]);

  if (!error) {
    return null;
  }

  // this error boundary accepts a custom error page for each scenario
  // on the AppRoute use the code -> errorElement: <ErrorBoundary fallback={<CustomErrorUI />} />

  return (
    <ErrorBoundary level={LEVEL_ERROR}>
      {fallback ? <>{fallback}</> : <RootErrorPage />}
    </ErrorBoundary>
  );
};
