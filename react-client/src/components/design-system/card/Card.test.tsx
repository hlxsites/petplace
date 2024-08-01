import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";

import { Card } from "./Card";

const { getByRole, getByText } = screen;

const DEFAULT_CHILDREN = "Test children";

describe("<Card />", () => {
  it.each(["A children", "Another children"])(
    "should render %p",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render radius=base by default", () => {
    getRenderer();
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("rounded-2xl");
  });

  it("should render radius=sm", () => {
    getRenderer({ radius: "sm" });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("rounded-xl");
  });

  it("should render default classes", () => {
    getRenderer({ radius: "sm" });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(
      "overflow-hidden border border-solid"
    );
  });

  it("should render shadowbox when shadow is applied", () => {
    getRenderer({ shadow: "elevation-1" });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("shadow-elevation-1");
  });

  it("should NOT render shadowbox when shadow is not applied", () => {
    getRenderer({ shadow: undefined });

    expect(getByText(DEFAULT_CHILDREN)).not.toHaveClass("shadow-elevation-1");
  });

  it.each(["button", "dialog", "menu", "presentation"])(
    "should render with role=%p",
    (expected) => {
      getRenderer({ role: expected });
      expect(getByRole(expected)).toBeInTheDocument();
    }
  );

  it.each(["base", "large"])(`should render padding=%p`, (expected) => {
    // @ts-expect-error - ignoring for test purposes
    getRenderer({ padding: expected });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`p-${expected}`);
  });
});

// Helpers
type Props = ComponentProps<typeof Card>;
function getRenderer({
  children = DEFAULT_CHILDREN,
  ...rest
}: Partial<Props> = {}) {
  return render(<Card {...rest}>{children}</Card>);
}
