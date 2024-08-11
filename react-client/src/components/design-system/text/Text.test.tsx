import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { Text } from "./Text";

const { getByRole, getByText } = screen;

const DEFAULT_CHILDREN = "Sample test";

describe("Text", () => {
  it.each(["My cool test", "Hello world"])(
    "should render given children as paragraph role",
    (children) => {
      getRenderer({ children });

      expect(getByRole("paragraph")).toHaveTextContent(children);
    }
  );

  it.each(["a-id", "another-id"])("should render with id=%p", (id) => {
    getRenderer({ id });
    expect(getByRole("paragraph")).toHaveAttribute("id", id);
  });

  it("should not render when ariaHidden=true", () => {
    getRenderer({ ariaHidden: true });
    expect(getByText(DEFAULT_CHILDREN)).toHaveAttribute("aria-hidden");
  });

  it("should render component with font-family as 'franklin' by default", () => {
    getRenderer();

    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("font-franklin");
  });

  it.each(["raleway", "roboto"] as ComponentProps<typeof Text>["fontFamily"][])(
    "should render component with raleway font-family",
    (fontFamily) => {
      getRenderer({ fontFamily });

      expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`font-${fontFamily}`);
    }
  );

  it("should render component with size xs by default", () => {
    getRenderer();

    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("text-xs");
  });

  it.each(["base", "sm"] as ComponentProps<typeof Text>["size"][])(
    "should render component with size %p",
    (size) => {
      getRenderer({ size });

      expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`text-${size}`);
    }
  );

  it("should render component with size large", () => {
    getRenderer({ size: "xlg" });

    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`text-xl`);
  });

  it("should render component with size large", () => {
    getRenderer({ size: "lg" });

    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`text-lg`);
  });

  it("should not be screen reader only by default", () => {
    getRenderer();
    expect(getByText(DEFAULT_CHILDREN)).not.toHaveClass("sr-only");
  });

  it("should be screen reader only when srOnly=true", () => {
    getRenderer({ srOnly: true });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("sr-only");
  });

  it.each(["left", "center", "right", "justify"] as ComponentProps<
    typeof Text
  >["align"][])("should render component with text aligned to %p", (align) => {
    getRenderer({ align });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`text-${align}`);
  });

  it.each([
    "black",
    "neutral-950",
    "primary-900",
    "secondary-700",
    "tertiary-600",
    "blue-500",
    "green-500",
  ] satisfies ComponentProps<typeof Text>["color"][])(
    "should render component with color %p",
    (color) => {
      getRenderer({ color });
      expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`text-${color}`);
    }
  );
});

function getRenderer({
  children = DEFAULT_CHILDREN,
  ...props
}: Partial<ComponentProps<typeof Text>> = {}) {
  return render(<Text {...props}>{children}</Text>);
}
