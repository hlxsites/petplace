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

  it.each(["a-id", "another-id"])('should render with id="%s"', (id) => {
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

  it("should render component with size large by default", () => {
    getRenderer();

    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("text-lg");
  });

  it.each(["base", "sm", "xs"] as ComponentProps<typeof Text>["size"][])(
    "should render component with size %s",
    (size) => {
      getRenderer({ size });

      expect(getByText(DEFAULT_CHILDREN)).toHaveClass(`text-${size}`);
    }
  );

  it("should not be screen reader only by default", () => {
    getRenderer();
    expect(getByText(DEFAULT_CHILDREN)).not.toHaveClass("sr-only");
  });

  it("should be screen reader only when srOnly=true", () => {
    getRenderer({ srOnly: true });
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass("sr-only");
  });
});

function getRenderer({
  children = DEFAULT_CHILDREN,
  ...props
}: Partial<ComponentProps<typeof Text>> = {}) {
  return render(<Text {...props}>{children}</Text>);
}
