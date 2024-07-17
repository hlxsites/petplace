import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { Checkbox } from "./Checkbox";

const { queryByText, getByRole } = screen;

const DEFAULT_LABEL = "Test label";
const DEFAULT_CLASSNAMES =
  "flex h-5 w-5 items-center justify-center rounded-md";

describe("<Checkbox />", () => {
  it("should render checkbox", () => {
    getRenderer();
    expect(getByRole("checkbox")).toBeInTheDocument();
  });

  it("should render with default classes", () => {
    getRenderer();
    expect(getByRole("checkbox")).toHaveClass(DEFAULT_CLASSNAMES);
  });

  it.each(["id-1", "id-2"])('should render with id "%s"', (expected) => {
    getRenderer({ id: expected });
    expect(getByRole("checkbox")).toHaveAttribute("id", expected);
  });

  it.each(["a-class", "another-class"])(
    "should render custom class '%s'",
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("checkbox")).toHaveClass(
        `${DEFAULT_CLASSNAMES} ${expected}`
      );
    }
  );

  it.each(["a label", "another label"])(
    "should render checkbox with label '%s'",
    (expected) => {
      getRenderer({ label: expected });
      expect(getByRole("checkbox", { name: expected })).toBeInTheDocument();
    }
  );

  it("should hide label element when hideLabel is true", () => {
    getRenderer({ hideLabel: true });
    expect(queryByText(DEFAULT_LABEL)).not.toBeInTheDocument();
  });

  it("should render checkbox with accessible aria-label when hideLabel is true", () => {
    getRenderer({ hideLabel: true });
    expect(getByRole("checkbox", { name: DEFAULT_LABEL })).toBeInTheDocument();
  });

  it.each([false, undefined])(
    "should render checkbox label when hideLabel is %s",
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

  it("should render check icon whe checked", () => {
    const { container } = getRenderer({ defaultChecked: true });

    expect(container.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgCheckIcon"
    );
  });

  it("should call event callbacks", async () => {
    const checkHandler = jest.fn();
    getRenderer({ onCheckedChange: checkHandler });
    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(checkHandler).toHaveBeenCalledTimes(2);
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
