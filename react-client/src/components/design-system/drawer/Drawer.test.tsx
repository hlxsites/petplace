import { render, screen, waitFor } from "@testing-library/react";
import { Drawer } from "./Drawer";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

const { getByText, getByRole, getByTestId, queryByRole } = screen;

describe("Drawer", () => {
  it("should render the drawer", () => {
    getRenderer();
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("should render the drawer's container with aria-hidden=true instead of the drawer", () => {
    getRenderer({ isOpen: false });
    expect(queryByRole("dialog")).not.toBeInTheDocument();
    expect(getByTestId("drawer-container")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("should render drawer with opening animations", () => {
    getRenderer();
    expect(getByRole("dialog")).toHaveClass(
      "animate-slideInFromBottom lg:animate-slideInFromRight"
    );
  });

  it.each(["Sample title", "Another title"])(
    "should render accessible drawer with title %s",
    (expected) => {
      getRenderer({ title: expected });
      expect(getByText(expected)).toHaveAttribute("id", expected);
      expect(getByRole("dialog")).toHaveAttribute("aria-labelledby", expected);
    }
  );

  it.each(["Sample children", "Another children"])(
    "should render drawer with children %s",
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

  it("should call onClose callbacks when close button is clicked", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    const closeButton = getByRole("dialog").querySelector("button");
    await userEvent.click(closeButton as Element);
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose callbacks when esc key is pressed", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    await userEvent.keyboard("[Escape]");
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose callbacks when clicking the drawer's parent element", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    const parentElement = getByRole("dialog").parentElement;
    await userEvent.click(parentElement as Element);
    expect(onClose).toHaveBeenCalled();
  });

  it("should open with focus on accessible close-drawer button", async () => {
    getRenderer();
    const closeButton = getByRole("dialog").querySelector("button");
    expect(closeButton).toHaveAttribute("aria-label", "Close drawer");
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
  });

  it("should return focus to the opening button when isClosed is set to false", async () => {
    const openingButtonId = "openerId";
    const drawerEnvironment = (openStatus: boolean) => (
      <>
        <Drawer
          title="Test title"
          onClose={() => {}}
          openingButtonId={openingButtonId}
          isOpen={openStatus}
        >
          Test children
        </Drawer>
        <button id={openingButtonId} data-testid={openingButtonId}>
          Test opening button
        </button>
      </>
    );

    const { rerender } = render(drawerEnvironment(true));

    const closeButton = getByRole("dialog").querySelector("button");
    await userEvent.click(closeButton as Element);

    rerender(drawerEnvironment(false));

    await waitFor(() => {
      const openingButton = getByTestId(openingButtonId);
      expect(openingButton).toHaveFocus();
    });
  });

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();
    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  title = "Test title",
  children = "Test children",
  openingButtonId = "SampleId",
  isOpen = true,
  onClose = () => {},
}: Partial<ComponentProps<typeof Drawer>> = {}) {
  return render(
    <>
      <Drawer
        title={title}
        onClose={onClose}
        openingButtonId={openingButtonId}
        isOpen={isOpen}
      >
        {children}
      </Drawer>
      <button id={openingButtonId} data-testid={openingButtonId}>
        Test opening button
      </button>
    </>
  );
}
