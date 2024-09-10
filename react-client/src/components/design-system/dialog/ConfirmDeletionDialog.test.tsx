import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { ConfirmDeletionDialog } from "./ConfirmDeletionDialog";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const DIALOG_TITLE = /Are you sure you want to delete this file?/i;

const { getByRole, getByText } = screen;

describe("ConfirmDeletionDialog", () => {
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

  it("should call onConfirm callback", async () => {
    const onConfirm = jest.fn();
    getRenderer({ onConfirm: onConfirm });

    expect(onConfirm).not.toHaveBeenCalled();
    await userEvent.click(getByRole("button", { name: "Yes, delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel callback", async () => {
    const onCancel = jest.fn();
    getRenderer({ onCancel: onCancel });

    expect(onCancel).not.toHaveBeenCalled();
    await userEvent.click(getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(onCancel).toHaveBeenCalledTimes(1));
  });
});

function getRenderer({
  isOpen = true,
  onCancel = jest.fn(),
  onConfirm = jest.fn(),
  ...rest
}: Partial<ComponentProps<typeof ConfirmDeletionDialog>> = {}) {
  return render(
    <ConfirmDeletionDialog
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      {...rest}
    />
  );
}
