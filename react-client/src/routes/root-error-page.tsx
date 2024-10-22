import { ErrorBoundary, LEVEL_ERROR } from "@rollbar/react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

import { Button, Icon, LinkButton } from "~/components/design-system";
import { Layout } from "~/components/design-system/layout/Layout";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { logError } from "~/infrastructure/telemetry/logUtils";
import { IS_DEV_ENV } from "~/util/envUtil";
import { ACCOUNT_FULL_ROUTE } from "./AppRoutePaths";

export const RootErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const rootLocation = IS_DEV_ENV ? ACCOUNT_FULL_ROUTE : window.location.origin;

  useDeepCompareEffect(() => {
    if (error) {
      if (isRouteErrorResponse(error)) {
        logError(
          `Route error: ${error.status} ${error.statusText}`,
          error.data
        );
      } else if (error instanceof Error) {
        logError("Uncaught route error", error);
      } else {
        logError("Unknown route error", error);
      }
    }
  }, [error]);

  return (
    <ErrorBoundary level={LEVEL_ERROR}>
      <Layout>
        <div className="m-auto grid max-w-[464px] place-items-center gap-base">
          <Icon display="alertDiamond" size={80} />
          <span
            className="text-center text-[28px] font-semibold"
            role="heading"
            aria-level={1}
          >
            Oops! Something went wrong.
          </span>

          <p className="text-xl w-full text-center">
            The page you requested could not be loaded. Please refresh the page
            or try again later.
          </p>

          <div className="mt-[16px] flex max-w-[366px] gap-small">
            <LinkButton
              children="Back Home"
              to={rootLocation}
              fullWidth={true}
              variant="secondary"
            />
            <Button
              fullWidth={true}
              variant="primary"
              children="Reload Page"
              onClick={onHandleReload}
            />
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );

  function onHandleReload() {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    if (isRouteErrorResponse(error)) {
      const parentPath = pathSegments.slice(0, -1).join("/");
      navigate(`/${parentPath}`);
    } else {
      const currentPath = location.pathname;
      navigate(currentPath);
    }
  }
};
