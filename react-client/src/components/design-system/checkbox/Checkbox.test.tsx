import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { Checkbox } from "./Checkbox";

const { queryByText, getByRole } = screen;

const DEFAULT_LABEL = "Test label";
const DEFAULT_CLASSNAMES =
  "flex h-5 w-5 items-center justify-center rounded-md";

describe("<Checkbox />", () => {
  it.each(["id-1", "id-2"])("should render with id %p", (expected) => {
    getRenderer({ id: expected });
    expect(getByRole("checkbox")).toHaveAttribute("id", expected);
  });

  it("should render with default classes", () => {
    getRenderer();
    expect(getByRole("checkbox")).toHaveClass(DEFAULT_CLASSNAMES);
  });

  it.each(["a-class", "another-class"])(
    "should render with default classes and custom class %p",
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("checkbox")).toHaveClass(
        `${DEFAULT_CLASSNAMES} ${expected}`
      );
    }
  );

  it.each(["a label", "another label"])(
    "should render checkbox with label %p",
    (expected) => {
      getRenderer({ label: expected });
      expect(getByRole("checkbox", { name: expected })).toBeInTheDocument();
    }
  );

  it("should render checkbox with accessible aria-label when hideLabel is true", () => {
    getRenderer({ hideLabel: true });
    expect(getByRole("checkbox", { name: DEFAULT_LABEL })).toBeInTheDocument();
  });

  it.each([false, undefined])(
    "should render checkbox label when hideLabel is %p",
    (expected) => {
      getRenderer({ hideLabel: expected });
      expect(queryByText(DEFAULT_LABEL)).toBeInTheDocument();
    }
  );

  it("should be enabled by default", () => {
    getRenderer();
    expect(getByRole("checkbox")).toBeEnabled();
  });

  it("should render checkbox disabled when disabled is true", () => {
    getRenderer({ disabled: true });
    expect(getByRole("checkbox")).toBeDisabled();
  });

  it("should render checkbox unchecked by default", () => {
    getRenderer();
    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should render checkbox checked", () => {
    getRenderer({ defaultChecked: true });
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should not render check icon when unchecked", () => {
    const { container } = getRenderer();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("should render check icon when checked", () => {
    const { container } = getRenderer({ defaultChecked: true });

    expect(container.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgCheckIcon"
    );
  });

  it("should call event onCheckedChange callback", async () => {
    const onCheckedChange = jest.fn();
    getRenderer({ onCheckedChange });

    const checkbox = getByRole("checkbox");
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(checkbox).not.toBeChecked();

    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });
});

// Helpers
type Props = ComponentProps<typeof Checkbox>;
function getRenderer({
  label = DEFAULT_LABEL,
  id = "Test id",
  ...rest
}: Partial<Props> = {}) {
  return render(<Checkbox label={label} id={id} {...rest} />);
}
