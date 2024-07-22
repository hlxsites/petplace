import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { Drawer } from "./Drawer";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const { getByText, getByRole, getByTestId } = screen;

describe("<Drawer />", () => {
  it("should render the drawer", () => {
    getRenderer();
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("should use FocusTrap", () => {
    getRenderer();
    expect(getByTestId("FocusTrap")).toBeInTheDocument();
  });

  it("should render drawer with opening animations", () => {
    getRenderer();
    expect(getByRole("dialog")).toHaveClass(
      "animate-slideInFromBottom lg:animate-slideInFromRight"
    );
  });

  it.each(["a-id", "another-id"])(
    "should render accessible drawer with id %p",
    (id) => {
      getRenderer({ id });
      expect(getByRole("dialog")).toHaveAttribute("id", id);
      expect(getByRole("dialog")).toHaveAttribute(
        "aria-labelledby",
        `${id}-title`
      );
    }
  );

  it.each(["Sample children", "Another children"])(
    "should render drawer with children %p",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render icon closeXMark", () => {
    getRenderer();
    expect(getByRole("dialog").querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgCloseXMarkIcon"
    );
  });

  it("should call onClose callback when close button is clicked", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    await userEvent.click(getByRole("button", { name: /close drawer$/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("should call onClose callbacks when esc key is pressed", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    await userEvent.keyboard("[Escape]");
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("should call onClose callbacks when clicking the drawer's backdrop", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    await userEvent.click(getByTestId("backdrop"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
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
    <>
      <Drawer title={title} onClose={onClose} id={id} isOpen={isOpen}>
        {children}
      </Drawer>
      <button aria-controls={id}>Test opening button</button>
    </>
  );
}
