import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";

import { Card } from "./Card";

const { getByText } = screen;

const DEFAULT_CHILDREN = "Test children";

describe("<Card />", () => {
  it.each(["A children", "Another children"])(
    `should render '%s'`,
    (expected) => {
      getRenderer({ children: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it(`should render radius=base by default`, () => {
    getRenderer();
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("rounded-2xl");
  });

  it(`should render radius=sm`, () => {
    getRenderer({ radius: "sm" });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("rounded-xl");
  });

  it(`should render default classes`, () => {
    getRenderer({ radius: "sm" });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(
      "overflow-hidden border border-solid"
    );
  });

  it(`should render shadowbox when hasShadow true`, () => {
    getRenderer({ hasShadow: true });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("shadow-elevation-1");
  });

  it.each([false, undefined])(
    `should NOT render shadowbox when hasShadow is %s`,
    (expected) => {
      getRenderer({ hasShadow: expected });

      expect(getByText(DEFAULT_CHILDREN)).not.toHaveClass("shadow-elevation-1");
    }
  );
});

// Helpers
type Props = ComponentProps<typeof Card>;
function getRenderer({
  children = DEFAULT_CHILDREN,
  ...rest
}: Partial<Props> = {}) {
  return render(<Card {...rest}>{children}</Card>);
}