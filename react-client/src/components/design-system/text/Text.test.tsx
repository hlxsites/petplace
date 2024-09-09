import { render, screen, waitFor } from "@testing-library/react";
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

  it("should render component with size 12 by default", () => {
    getRenderer();

    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("text-12");
  });

  it.each([
    ["40", "text-40 leading-10"],
    ["32", "text-32 leading-8"],
    ["24", "text-24 leading-7"],
    ["20", "text-20 leading-7"],
    ["18", "text-18 leading-7"],
    ["16", "text-16 leading-6"],
    ["14", "text-14 leading-5"],
    ["12", "text-12 leading-4"],
  ])("should render component with size %p px", (size, expected) => {
    // @ts-expect-error - ignoring for test purposes only
    getRenderer({ size });

    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`${expected}`);
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
  ])("should render component with color %p", (color) => {
    // @ts-expect-error - ignoring for test purposes only
    getRenderer({ color });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`text-${color}`);
  });

  it.each([
    ["none", "no-underline"],
    ["line-through", "line-through"],
    ["underline", "underline"],
  ])(
    "should render component with text decoration: %s",
    (textDecoration, expected) => {
      // @ts-expect-error - ignoring for test purposes only
      getRenderer({ textDecoration });
      expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`${expected}`);
    }
  );

  it.each([
    ["18", "text-14 leading-5"],
    ["16", "text-14 leading-5"],
    ["14", "text-12 leading-4"],
  ])(
    "should render component responsive for sizes=%s",
    async (size, expected) => {
      setViewportWidth(500);
      // @ts-expect-error - ignoring for test purposes only
      getRenderer({ size, isResponsive: true });
      await waitFor(() =>
        expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`${expected}`)
      );
    }
  );
});

function getRenderer({
  children = DEFAULT_CHILDREN,
  ...props
}: Partial<ComponentProps<typeof Text>> = {}) {
  return render(<Text {...props}>{children}</Text>);
}

// Helper function to set viewport width
const setViewportWidth = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
};