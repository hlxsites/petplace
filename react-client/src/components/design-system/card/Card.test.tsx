import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";

import { Card } from "./Card";

const { getByText } = screen;

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
    const card = getByText("Test children").parentElement;
    expect(card).toHaveClass("rounded-2xl");
  });

  it(`should render radius=sm`, () => {
    getRenderer({ radius: "sm"});
    const card = getByText("Test children").parentElement;
    expect(card).toHaveClass("rounded-xl");
  });

  it(`should render shadowbox`, () => {
    getRenderer({ hasShadow: true });
    const card = getByText("Test children").parentElement;
    expect(card).toHaveClass("shadow-elevation-1");
  });
});

// Helpers
type Props = ComponentProps<typeof Card>;
function getRenderer({
  children = <p>Test children</p>,
  ...rest
}: Partial<Props> = {}) {
  return render(<Card {...rest}>{children}</Card>);
}
