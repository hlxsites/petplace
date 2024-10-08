import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { Drawer } from "./Drawer";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const { getByRole } = screen;

describe("Drawer", () => {
  it("should render the drawer", () => {
    getRenderer();
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("should apply correct classNames for drawer", () => {
    getRenderer();
    expect(getByRole("dialog")).toHaveClass(
      "fixed z-50 bg-neutral-white duration-300 ease-in-out bottom-0 right-0 top-0 rounded-l-2xl p-xlarge animate-slideInFromBottom lg:animate-slideInFromRight"
    );
  });

  it("should render close button with expected className", () => {
    getRenderer();
    expect(getByRole("button", { name: "Close drawer" })).toHaveClass(
      "text-neutral-600"
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
}: Partial<ComponentProps<typeof Drawer>> = {}) {
  return render(
    <Drawer
      id={id}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      trigger={trigger}
    >
      {children}
    </Drawer>
  );
}
