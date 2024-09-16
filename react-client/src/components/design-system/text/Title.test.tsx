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

  it.each([
    ["lg:text-[44px] text-[32px]/[36px]", "h1"],
    ["lg:text-[32px]/[36px] text-[24px]/[28px]", "h2"],
    ["lg:text-[24px]/[28px] text-[18px]/[20px]", "h3"],
    ["lg:text-[18px]/[20px] text-[16px]/[20px]", "h4"],
    ["lg:text-[16px]/[20px] text-[14px]/[16px]", "h5"],
  ])(`should manage classes and levels accordingly`, (classes, level) => {
    getRenderer({ level: level as Props["level"] });
    expect(getByRole("heading")).toHaveClass(
      `font-bold text-neutral-950 ${classes}`
    );
  });

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();

    expect(container).toMatchSnapshot();
  });

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
});

// Helpers
type Props = ComponentProps<typeof Title>;
function getRenderer({
  children = "Sample Title",
  ...rest
}: Partial<Props> = {}) {
  return render(<Title {...rest}>{children}</Title>);
}
