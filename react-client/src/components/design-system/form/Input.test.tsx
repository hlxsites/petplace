import { render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { IconKeys } from "../icon/Icon";
import Input from "./Input";

type InputProps = ComponentProps<typeof Input>;

const { getByRole, getByLabelText } = screen;

describe("<Input />", () => {
  it.each(["input-id", "another-id"])(
    "should render an input with an id %p",
    (expected) => {
      getRenderer({ id: expected });
      expect(getByRole("textbox")).toHaveAttribute("id", expected);
    }
  );

  it.each(["A label", "Another label"])(
    "should render an input with a label %p",
    (expected) => {
      getRenderer({ label: expected });
      expect(getByRole("textbox", { name: expected })).toBeInTheDocument();
    }
  );

  it("should include optional text in the label when required is false", () => {
    getRenderer({ label: "A label", required: false });
    expect(
      getByRole("textbox", { name: "A label (optional)" })
    ).toBeInTheDocument();
  });

  it.each(["text", "email", "password"])(
    "should render an input with type %p",
    (expected) => {
      getRenderer({ type: expected as InputProps["type"] });
      expect(getByLabelText("The Input")).toHaveAttribute("type", expected);
    }
  );

  it("should render an input with a value", () => {
    getRenderer({ value: "The value" });
    expect(getByRole("textbox")).toHaveValue("The value");
  });

  it.each(["a placeholder", "another placeholder"])(
    "should render an input with a placeholder %p",
    (expected) => {
      getRenderer({ placeholder: expected });
      expect(getByRole("textbox")).toHaveAttribute("placeholder", expected);
    }
  );

  it.each(["error", "another error"])(
    "should render error message %p",
    (expected) => {
      getRenderer({ errorMessage: expected });

      const textbox = getByRole("textbox");
      expect(textbox).toHaveAttribute("aria-invalid", "true");
      expect(textbox).toHaveAccessibleErrorMessage(expected);
    }
  );

  it.each(["a description message", "another description message"])(
    "should render description message %p",
    (expected) => {
      getRenderer({ description: expected });

      const textbox = getByRole("textbox");
      expect(textbox).toHaveAttribute("aria-describedby", "input-description");
      expect(textbox).toHaveAccessibleDescription(expected);
    }
  );

  it("should render an input with a required attribute", () => {
    getRenderer({ required: true });
    expect(getByRole("textbox")).toBeRequired();
  });

  it("should render an input with a disabled attribute", () => {
    getRenderer({ disabled: true });
    expect(getByRole("textbox")).toBeDisabled();
  });

  it("should render a focused input", () => {
    getRenderer({ autoFocus: true });
    expect(getByRole("textbox")).toHaveFocus();
  });

  it.each([
    { iconLeft: { display: "search" as IconKeys } },
    { iconRight: { display: "add" as IconKeys } },
  ])("should display input icon", (expected) => {
    const { container } = getRenderer(expected);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });
});

// Helpers
function getRenderer({
  id = "input",
  label = "The Input",
  required = true,
  ...rest
}: Partial<InputProps> = {}) {
  return render(<Input id={id} label={label} required={required} {...rest} />);
}
