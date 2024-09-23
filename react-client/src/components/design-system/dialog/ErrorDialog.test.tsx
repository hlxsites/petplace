import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { ErrorDialog } from "./ErrorDialog";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const DIALOG_TITLE = "Dialog title";

const { getByRole, getByText } = screen;

describe("ErrorDialog", () => {
  it("should open dialog with confirm title", () => {
    getRenderer();

    expect(getByRole("heading", { name: DIALOG_TITLE })).toBeInTheDocument();
  });

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

  it("should call onCancel callback", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});

function getRenderer({
  isOpen = true,
  message = "Dialog message",
  onClose = jest.fn(),
  title = DIALOG_TITLE,
  trigger = undefined,
}: Partial<ComponentProps<typeof ErrorDialog>> = {}) {
  return render(
    <ErrorDialog
      isOpen={isOpen}
      onClose={onClose}
      message={message}
      trigger={trigger}
      title={title}
    />
  );
}
