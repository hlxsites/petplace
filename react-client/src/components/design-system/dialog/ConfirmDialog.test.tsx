import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const CONFIRM_BUTTON_LABEL = "Confirm button";
const DIALOG_TITLE = "Dialog title";

const { getByRole, getByText } = screen;

describe("ConfirmDialog", () => {
  it.each(["My title test", "Random Title"])(
    "should open dialog with given title",
    (title) => {
      getRenderer({ title });

      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["a message", "another message"])(
    "should render message as string %p",
    (message) => {
      getRenderer({ message });
      expect(getByText(message)).toBeInTheDocument();
    }
  );

  it("should render message as a component", () => {
    const message = <p>Message as ReactNode</p>;
    getRenderer({ message });
    expect(getByText("Message as ReactNode")).toBeInTheDocument();
  });

  it("should call onClose callback", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("should render confirm button when confirmButtonLabel is provided", () => {
    getRenderer({
      confirmButtonLabel: CONFIRM_BUTTON_LABEL,
    });

    expect(
      getByRole("button", { name: CONFIRM_BUTTON_LABEL })
    ).toBeInTheDocument();
  });

  it("should call onClickPrimaryButton when confirm button is clicked", async () => {
    const onClickPrimaryButton = jest.fn();
    getRenderer({
      confirmButtonLabel: CONFIRM_BUTTON_LABEL,
      onClickPrimaryButton,
    });

    expect(onClickPrimaryButton).not.toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("button", { name: CONFIRM_BUTTON_LABEL })
    );
    expect(onClickPrimaryButton).toHaveBeenCalledTimes(1);
  });

  it.each(["confirm", "error"])(
    "should render aria-label based on given type=%s",
    (type) => {
      // @ts-expect-error for testing purposes
      getRenderer({ type });

      expect(getByRole("dialog")).toHaveAttribute(
        "aria-label",
        `${type}-dialog`
      );
    }
  );

  it("should render clearCircle as default", () => {
    getRenderer();
    expect(
      document.querySelector("svg[data-file-name='SvgClearCircleIcon']")
    ).toBeInTheDocument();
  });

  it("should render the given icon", () => {
    getRenderer({ icon: "add" });
    expect(
      document.querySelector("svg[data-file-name='SvgAddIcon']")
    ).toBeInTheDocument();
  });
});

function getRenderer({
  confirmButtonLabel = "yes",
  isOpen = true,
  message = "Dialog message",
  onClose = jest.fn(),
  onClickPrimaryButton = jest.fn(),
  title = DIALOG_TITLE,
  trigger = undefined,
  type = "confirm",
  ...rest
}: Partial<ComponentProps<typeof ConfirmDialog>> = {}) {
  return render(
    <ConfirmDialog
      confirmButtonLabel={confirmButtonLabel}
      isOpen={isOpen}
      onClose={onClose}
      onClickPrimaryButton={onClickPrimaryButton}
      message={message}
      trigger={trigger}
      title={title}
      type={type}
      {...rest}
    />
  );
}
