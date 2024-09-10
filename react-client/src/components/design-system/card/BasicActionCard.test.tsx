import { render, screen } from "@testing-library/react";
import { BasicActionCard } from "./BasicActionCard";
import { ComponentProps } from "react";

const { getByRole, getByText } = screen;

describe("BasicActionCard", () => {
  it("should render component with expected role", () => {
    getRenderer();
    expect(getByRole("region")).toBeInTheDocument();
  });

  it.each(["Random title", "Amazing title"])(
    "should render the given title",
    (title) => {
      getRenderer({ title });
      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["Random message", "Amazing message"])(
    "should render the given message",
    (message) => {
      getRenderer({ message });
      expect(getByText(message)).toBeInTheDocument();
    }
  );

  it.each(["Random label", "Amazing label"])(
    "should render the given button label",
    (buttonLabel) => {
      getRenderer({ buttonLabel });
      expect(getByRole("button", { name: buttonLabel })).toBeInTheDocument();
    }
  );

  it("should accept the given titleProps", () => {
    const color = "blue-300";

    getRenderer({ title: "Test", titleProps: { color } });

    expect(getByRole("heading", { name: "Test" })).toHaveClass(`text-${color}`);
  });

  it("should accept the given buttonProps", () => {
    getRenderer({ buttonProps: { variant: "primary" } });
    expect(getByRole("button", { name: "Test button label" })).toHaveClass(
      "bg-orange-300-contrast text-white"
    );
  });

  it("should accept the given textProps", () => {
    getRenderer({
      message: "Message",
      textProps: { fontFamily: "raleway" },
    });
    expect(getByText("Message")).toHaveClass("font-raleway");
  });
});

function getRenderer({
  buttonLabel = "Test button label",
  ...props
}: Partial<ComponentProps<typeof BasicActionCard>> = {}) {
  return render(<BasicActionCard {...props} buttonLabel={buttonLabel} />);
}
