import { ComponentProps, JSX } from "react";
import { Link } from "react-router-dom";

import { Button, ButtonProps, Icon } from "~/components/design-system";
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
      <div className="m-auto grid max-w-[464px] place-items-center gap-4">
        <Icon display="alert" size={80} />
        <span className="text-center text-[28px] font-semibold" role="heading">
          Oops! Something went wrong.
        </span>

        <span className="w-full text-center text-xl" role="text">
          The page you requested could not be loaded. Please refresh the page or
          try again later.
        </span>

        <div className="mt-[16px] flex max-w-[366px] gap-4">
          {errorButtons.map((button) => (
            <Link to={button.to}>
              <Button
                className="w-[163px] lg:w-[175px]"
                fullWidth={true}
                variant={button.variant}
              >
                {button.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};
