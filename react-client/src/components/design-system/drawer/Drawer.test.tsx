import { render, screen } from "@testing-library/react";
import { Drawer } from "./Drawer";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

const { getByTestId, getByText } = screen;

describe("Drawer", () => {
  it("should render drawer", () => {
    getRenderer();
    expect(getByTestId("drawer")).toBeInTheDocument();
  });

  it.each(["Sample title", "Another title"])(
    "should render drawer with title %s",
    (expected) => {
      getRenderer({ title: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["Sample children", "Another children"])(
    "should render drawer with title %s",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render icon closeXMark", () => {
    const { container } = getRenderer();
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgCloseXMarkIcon"
    );
  });

  it("should call onClose callbacks on clicking icon", async () => {
    const onClose = jest.fn();
    const { container } = getRenderer({ onClose });

    const closeButton = container.querySelector("svg");
    await userEvent.click(closeButton as Element);
    expect(onClose).toHaveBeenCalled();
  });
});

function getRenderer({
  title = "Test title",
  children = "Test children",
  onClose = () => {},
}: Partial<ComponentProps<typeof Drawer>> = {}) {
  return render(
      <Drawer title={title} onClose={onClose}>
        {children}
      </Drawer>
  );
}
