import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { DialogBase } from "./DialogBase";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const { getByText, getByRole, getByTestId } = screen;

describe("DialogBase", () => {
  it("should render the dialogBase", () => {
    getRenderer();
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("should use FocusTrap", () => {
    getRenderer();
    expect(getByTestId("FocusTrap")).toBeInTheDocument();
  });

  it("should render element drawer with its specific opening animations", () => {
    getRenderer({ element: "drawer" });
    expect(getByRole("dialog")).toHaveClass(
      "animate-slideInFromBottom lg:animate-slideInFromRight"
    );
  });

  it.each(["a-id", "another-id"])(
    "should render accessible baseDialog with id %p",
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
    "should render dialogBase with children %p",
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

  it.each(["dialog", "drawer"] as ComponentProps<
    typeof DialogBase
  >["element"][])(
    "should call onClose callback when close button is clicked",
    async (element) => {
      const onClose = jest.fn();
      getRenderer({ element, onClose });

      await userEvent.click(getByRole("button", { name: `Close ${element}` }));
      await waitFor(() => expect(onClose).toHaveBeenCalled());
    }
  );

  it("should call onClose callbacks when esc key is pressed", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    await userEvent.keyboard("[Escape]");
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("should call onClose callbacks when clicking the dialogBase's backdrop", async () => {
    const onClose = jest.fn();
    getRenderer({ onClose });

    await userEvent.click(getByTestId("backdrop"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("should render the icon when the icon prop is provided", () => {
    getRenderer({ icon: "alertDiamond" });

    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgAlertDiamondIcon"
    );
  });
});

function getRenderer({
  ariaLabel = "Aria label test",
  children = "Test children",
  element = "dialog",
  icon,
  id = "SampleId",
  isOpen = true,
  onClose = jest.fn(),
  title = "Test title",
}: Partial<ComponentProps<typeof DialogBase>> = {}) {
  return render(
    <>
      <DialogBase
        ariaLabel={ariaLabel}
        element={element}
        icon={icon}
        id={id}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      >
        {children}
      </DialogBase>
      <button aria-controls={id}>Test opening button</button>
    </>
  );
}
