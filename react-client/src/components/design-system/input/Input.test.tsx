import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import Input from "./Input";
import { IconKeys } from "../icon/Icon";

const { getByRole, getByText, getByTestId } = screen;

describe("<Input />", () => {
  it.each(["Label", "Another label"])(
    "should render input with id '%s'",
    (expected) => {
      getRenderer({ id: expected });
      expect(getByRole("textbox")).toHaveAttribute("id", expected);
    }
  );

  it.each(["Label", "Another label"])(
    "should render input with label '%s'",
    (expected) => {
      getRenderer({ label: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should call onChange callback", async () => {
    const onChange = jest.fn();

    getRenderer({ onChange });
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.type(getByRole("textbox"), "input text");
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(10);
  });

  it("should have type='text' by default", () => {
    getRenderer();
    expect(getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("should render input with type email", () => {
    getRenderer({ type: "email" });
    expect(getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("should render input with squared classes", () => {
    getRenderer({ squared: true });
    expect(getByTestId("input-container")).toHaveClass("rounded-lg");
  });

  it("should be enabled by default", () => {
    getRenderer();
    expect(getByRole("textbox")).toBeEnabled();
  });

  it.each(["input placeholder", "another placeholder"])(
    "should display input's placeholder",
    (expected) => {
      getRenderer({ placeholder: expected });
      expect(getByRole("textbox")).toHaveAttribute("placeholder", expected);
    }
  );

  it("should be disabled", async () => {
    const onChange = jest.fn();

    getRenderer({ disabled: true });

    const input = getByRole("textbox");
    expect(input).toBeDisabled();

    await userEvent.type(input, "input text");
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each([
    { iconLeft: { display: "search" as IconKeys } },
    { iconRight: { display: "add" as IconKeys } },
  ])("should display input icon", (expected) => {
    const { container } = getRenderer(expected);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  it.each(["sample message", "another message"])(
    "should display input's message '%s'",
    (expected) => {
      getRenderer({ message: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should display as error input", () => {
    getRenderer({ error: true });
    expect(getByRole("textbox")).toHaveClass("text-text-danger-default");
  });

  it.each(["sample error message", "another error message"])(
    "should display input's error message '%s'",
    (expected) => {
      getRenderer({ error: true, errorMessage: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );
});

// Helpers
type Props = ComponentProps<typeof Input>;
function getRenderer({ id = "id", ...props }: Partial<Props> = {}) {
  return render(<Input id={id} {...props} />);
}
