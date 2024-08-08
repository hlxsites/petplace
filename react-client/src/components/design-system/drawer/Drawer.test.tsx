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
      "fixed bottom-0 left-0 right-0 z-50 max-h-90vh w-full rounded-t-2xl bg-neutral-white p-xlarge duration-300 ease-in-out lg:left-auto lg:top-0 lg:max-h-screen lg:w-[336px] lg:rounded-none"
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
  title = "Test title",
  children = "Test children",
  id = "SampleId",
  isOpen = true,
  onClose = jest.fn(),
}: Partial<ComponentProps<typeof Drawer>> = {}) {
  return render(
    <Drawer title={title} onClose={onClose} id={id} isOpen={isOpen}>
      {children}
    </Drawer>
  );
}
