import { render, screen } from "@testing-library/react";
import { Text } from "./Text";
import { ComponentProps } from "react";

const { getByRole, getByText, queryByText } = screen;

describe("Text", () => {
  it.each(["My cool test", "Hello world"])(
    "should render given children as paragraph role",
    (children) => {
      getRenderer({ children });

      expect(getByRole("paragraph")).toHaveTextContent(children);
    }
  );

  it("should render component with aria-live='polite' by default", () => {
    getRenderer();

    expect(getByText("Sample test")).toHaveAttribute("aria-live", "polite");
  });

  it("should component accept all props to improve accessibility", () => {
    getRenderer({
      ariaDescribedby: "description",
      ariaLabel: "Label for test",
      ariaLabelledBy: "labelledby-id",
      ariaLive: "assertive",
      isHidden: true,
    });

    const element = getByText("Sample test");
    expect(element).toHaveAttribute("aria-describedby", "description");
    expect(element).toHaveAttribute("aria-label", "Label for test");
    expect(element).toHaveAttribute("aria-labelledby", "labelledby-id");
    expect(element).toHaveAttribute("aria-live", "assertive");
    expect(queryByText("Sample Test")).not.toBeInTheDocument();
  });

  it("should render component with font-family as 'franklin' by default", () => {
    getRenderer();

    expect(getByText("Sample test")).toHaveClass("font-franklin");
  });

  it.each(["raleway", "roboto"] as ComponentProps<typeof Text>["fontFamily"][])(
    "should render component with raleway font-family",
    (fontFamily) => {
      getRenderer({ fontFamily });

      expect(getByText("Sample test")).toHaveClass(`font-${fontFamily}`);
    }
  );

  it("should render component with size large by default", () => {
    getRenderer();

    expect(getByText("Sample test")).toHaveClass("text-lg");
  });

  it.each(["base", "sm", "xs"] as ComponentProps<typeof Text>["size"][])(
    "should render component with size %s",
    (size) => {
      getRenderer({ size });

      expect(getByText("Sample test")).toHaveClass(`text-${size}`);
    }
  );
});

function getRenderer({
  children = "Sample test",
  ...props
}: Partial<ComponentProps<typeof Text>> = {}) {
  return render(<Text {...props}>{children}</Text>);
}
