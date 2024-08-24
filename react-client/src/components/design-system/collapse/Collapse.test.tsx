import { render, screen, waitFor } from "@testing-library/react";
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
  it("should render collapse trigger with default", () => {
    getRenderer();
    expect(getByTestId(TEST_ID).firstChild).toHaveClass(DEFAULT_CLASSES);
  });

  it("should render the collapse children", () => {
    getRenderer({ isOpen: true });
    expect(getByText(DEFAULT_CHILDREN)).toBeInTheDocument();
  });

  it("should hide content wrapper element when it is closed", async () => {
    getRenderer({ isOpen: false });
    await waitFor(() =>
      expect(getByTestId("CollapseContentWrapper")).toHaveStyle({ opacity: 0 })
    );
  });

  it("should show content wrapper element when it is open", async () => {
    getRenderer({ isOpen: true });
    await waitFor(() =>
      expect(getByTestId("CollapseContentWrapper")).toHaveStyle({ opacity: 1 })
    );
  });

  it("should render the collapse disabled", () => {
    getRenderer({ disabled: true });
    expect(queryByText(DEFAULT_TRIGGER)).toBeDisabled();
  });

  it("should render the correct icons", () => {
    const { container } = getRenderer();
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgChevronDownIcon"
    );
  });

  it("should not render the trigger button if it isLocked", () => {
    getRenderer({ isLocked: true });
    expect(queryByText(DEFAULT_TRIGGER)?.parentElement?.tagName).not.toBe("BUTTON");
  });

  it("should rotate the icon when it is open", () => {
    const { container } = getRenderer({ isOpen: true });
    expect(container.querySelector("svg")?.parentElement).toHaveClass(
      "rotate-180 transform"
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
  title = DEFAULT_TRIGGER,
  onOpenChange = jest.fn(),
  ...rest
}: Partial<Props> = {}) {
  return render(
    <Collapse
      {...rest}
      isOpen={isOpen}
      title={title}
      onOpenChange={onOpenChange}
    >
      {children}
    </Collapse>
  );
}
