import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";

import { Title } from "./Title";

const { getByRole, getByText } = screen;

describe("<Title />", () => {
  it.each(["A heading", "Another heading"])("should render %p", (expected) => {
    getRenderer({ children: expected });
    expect(getByText(expected)).toBeInTheDocument();
  });

  it("should render H1 by default", () => {
    getRenderer();
    expect(getByRole("heading").tagName).toBe("H1");
  });

  it.each(["H2", "H3", "H4", "H5", "H6"])(
    "should render a %p tag",
    (expected) => {
      getRenderer({ level: expected.toLowerCase() as Props["level"] });
      expect(getByRole("heading").tagName).toBe(expected);
    }
  );

  it.each(["40", "28", "12"] as ComponentProps<typeof Title>["size"][])(
    "should render size as priority over level",
    (size) => {
      getRenderer({ level: "h1", size });
      expect(getByRole("heading")).toHaveClass(`text-${size}`);
    }
  );

  it.each([
    ["h1", "44"],
    ["h2", "32"],
    ["h3", "24"],
    ["h4", "18"],
    ["h5", "16"],
  ])(
    "should render title with expected default level sizes",
    (level, expectedSize) => {
      // @ts-expect-error - ignoring for test purposes only
      getRenderer({ level });
      expect(getByRole("heading")).toHaveClass(`text-${expectedSize}`);
    }
  );

  it.each(["12", "14", "16", "18", "20", "24", "28", "32", "36", "40", "44"])(
    "should render size=%s",
    (size) => {
      // @ts-expect-error - ignoring for test purposes only
      getRenderer({ size });
      expect(getByRole("heading")).toHaveClass(`text-${size}`);
    }
  );

  it.each([
    ["16", "14"],
    ["24", "18"],
    ["32", "24"],
    ["36", "24"],
    ["44", "24"],
  ])(
    "should render correct classes for size=%p when it's responsive",
    (size, mobileSize) => {
      // @ts-expect-error - ignoring for test purposes only
      getRenderer({ isResponsive: true, size });
      expect(getByRole("heading")).toHaveClass(
        `lg:text-${size} text-${mobileSize}`
      );
    }
  );

  it.each(["blue-500", "neutral-950"] satisfies ComponentProps<
    typeof Title
  >["color"][])("should render with colors", (color) => {
    getRenderer({ color });

    expect(getByRole("heading")).toHaveClass(`text-${color}`);
  });

  it("should render component with neutral-950 color class by default", () => {
    getRenderer();

    expect(getByRole("heading")).toHaveClass("text-neutral-950");
  });

  it("should render component with leading of 110% by default", () => {
    getRenderer();
    expect(getByRole("heading")).toHaveClass("leading-[1.1]");
  });

  it("should render component with bold by default", () => {
    getRenderer();
    expect(getByRole("heading")).toHaveClass("font-bold");
  });
});

// Helpers
type Props = ComponentProps<typeof Title>;
function getRenderer({
  children = "Sample Title",
  ...rest
}: Partial<Props> = {}) {
  return render(<Title {...rest}>{children}</Title>);
}