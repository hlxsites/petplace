import { ComponentProps, JSX } from "react";
import { Link } from "react-router-dom";

import { ButtonProps, Icon, LinkButton } from "~/components/design-system";
import { Layout } from "~/components/design-system/layout/Layout";

type ErrorButtons = ButtonProps & ComponentProps<typeof Link>;

export const RootErrorPage = (): JSX.Element => {
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
    <Layout>
      <div className="gap-base m-auto grid max-w-[464px] place-items-center">
        <Icon display="alert" size={80} />
        <span
          className="text-center text-[28px] font-semibold"
          role="heading"
          aria-level={1}
        >
          Oops! Something went wrong.
        </span>

        <p className="w-full text-center text-xl">
          The page you requested could not be loaded. Please refresh the page or
          try again later.
        </p>

        <div className="mt-[16px] flex max-w-[366px] gap-small">
          {errorButtons.map((button) => (
            <LinkButton
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
  );
};