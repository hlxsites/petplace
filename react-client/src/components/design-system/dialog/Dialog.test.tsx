import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { Dialog } from "./Dialog";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const { getByRole } = screen;

describe("Dialog", () => {
  it("should render the dialog", () => {
    getRenderer();
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("should apply correct class names for dialog", () => {
    getRenderer();
    expect(getByRole("dialog")).toHaveClass(
      "fixed inset-0 z-50 m-auto max-h-max max-w-max rounded-2xl bg-neutral-white p-xlarge ease-out"
    );
  });

  it("should render close button with expected className", () => {
    getRenderer();
    expect(getByRole("button", { name: "Close dialog" })).toHaveClass(
      "absolute right-[2px] top-[-41px] text-neutral-white"
    );
  });
});

function getRenderer({
  children = "Test children",
  id = "SampleId",
  isOpen = true,
  onClose = jest.fn(),
  title = "Test title",
  trigger = undefined,
}: Partial<ComponentProps<typeof Dialog>> = {}) {
  return render(
    <Dialog
      id={id}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      trigger={trigger}
    >
      {children}
    </Dialog>
  );
}
