import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { Collapse } from "./Collapse";

const { getByTestId, queryByText, getByText, getByRole } = screen;

const TEST_ID = "collapse";
const DEFAULT_CHILDREN = "Test children";
const DEFAULT_TRIGGER = "Test trigger";
const DEFAULT_CLASSES =
  "flex w-full justify-between bg-transparent p-0 text-black hover:bg-transparent focus:bg-transparent focus:outline-none active:bg-transparent";

describe("<Collapse />", () => {
  it("should render the collapse", () => {
    getRenderer();
    expect(getByTestId(TEST_ID)).toBeInTheDocument();
  });

  it("should render collapse trigger with default", () => {
    getRenderer();
    expect(getByTestId(TEST_ID).firstChild).toHaveClass(DEFAULT_CLASSES);
  });

  it.each(["a-class", "another-class"])(
    "should render the collapse trigger with custom classes",
    (expected) => {
      getRenderer({ className: expected });
      expect(getByTestId(TEST_ID).firstChild).toHaveClass(
        `${DEFAULT_CLASSES} ${expected}`
      );
    }
  );

  it("should render the collapse children", () => {
    getRenderer({ isOpen: true });
    expect(getByText(DEFAULT_CHILDREN)).toBeInTheDocument();
  });

  it("should not render the collapse children", () => {
    getRenderer({ isOpen: false });
    expect(queryByText(DEFAULT_CHILDREN)).not.toBeInTheDocument();
  });

  it("should render the collapse disabled", () => {
    getRenderer({ disabled: true });
    expect(queryByText(DEFAULT_TRIGGER)).toBeDisabled();
  });

  it.each([
    [true, "ChevronUp"],
    [false, "ChevronDown"],
  ])("should render the correct icons accordingly", (isOpen, iconName) => {
    const { container } = getRenderer({ isOpen });
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      `Svg${iconName}Icon`
    );
  });

  it("should call onOpenChange callback when clicked on trigger", async () => {
    const onOpenChange = jest.fn();

    getRenderer({ onOpenChange });
    expect(onOpenChange).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button", { name: DEFAULT_TRIGGER }));
    await userEvent.click(getByRole("button", { name: DEFAULT_TRIGGER }));
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });
});

// Helpers
type Props = ComponentProps<typeof Collapse>;
function getRenderer({
  isOpen = true,
  children = DEFAULT_CHILDREN,
  trigger = DEFAULT_TRIGGER,
  onOpenChange = jest.fn(),
  ...rest
}: Partial<Props> = {}) {
  return render(
    <Collapse
      {...rest}
      isOpen={isOpen}
      trigger={trigger}
      onOpenChange={onOpenChange}
    >
      {children}
    </Collapse>
  );
}
