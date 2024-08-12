import { render, screen } from "@testing-library/react";
import { ConfirmDeletionDialog } from "./ConfirmDeletionDialog";
import { ComponentProps } from "react";

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
  it(`should open dialog with confirm title as ${DIALOG_TITLE}`, () => {
    getRenderer();

    expect(getByRole("heading", { name: DIALOG_TITLE })).toBeInTheDocument();
  });

  it.each(["My doc", "Cat vaccines"])(
    "should render dialog message with the given fileName",
    (fileName) => {
      getRenderer({ fileName });
      expect(
        getByText(
          `You are about to permanently delete important pet records including: ${fileName}? This action cannot be undone.`
        )
      ).toBeInTheDocument();
    }
  );

  it("should call onConfirmDeletion callback", () => {
    const onConfirmDeletion = jest.fn();
    getRenderer({ onConfirmDeletion });

    expect(onConfirmDeletion).not.toHaveBeenCalled();
    getByRole("button", { name: "Yes, delete" }).click();
    expect(onConfirmDeletion).toHaveBeenCalledTimes(1);
  });

  it("should call onClose callback", () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    expect(onClose).not.toHaveBeenCalled();
    getByRole("button", { name: "Cancel" }).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

function getRenderer({
  fileName = "Test",
  isOpen = true,
  onClose = jest.fn(),
  onConfirmDeletion = jest.fn(),
}: Partial<ComponentProps<typeof ConfirmDeletionDialog>> = {}) {
  return render(
    <ConfirmDeletionDialog
      fileName={fileName}
      isOpen={isOpen}
      onClose={onClose}
      onConfirmDeletion={onConfirmDeletion}
    />
  );
}
