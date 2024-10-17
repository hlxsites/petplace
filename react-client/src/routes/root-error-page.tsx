import { ErrorBoundary, LEVEL_ERROR } from "@rollbar/react";
import { ComponentProps } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

import { ButtonProps, Icon, LinkButton } from "~/components/design-system";
import { Layout } from "~/components/design-system/layout/Layout";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { logError } from "~/infrastructure/telemetry/logUtils";

type ErrorButtons = ButtonProps & ComponentProps<typeof Link>;

export const RootErrorPage = () => {
  const error = useRouteError();

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

  const errorButtons: ErrorButtons[] = [
    {
      name: "Back Home",
      to: "https://www.petplace.com/",
      variant: "secondary",
    },
    {
      name: "Reload Page",
      relative: "path",
      to: "..",
      variant: "primary",
    },
  ];

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
            {errorButtons.map((button) => (
              <LinkButton
                key={button.name}
                to={button.to}
                fullWidth={true}
                variant={button.variant}
              >
                {button.name}
              </LinkButton>
            ))}
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
};
