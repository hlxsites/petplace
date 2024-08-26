import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";

import { DragAndDropZone } from "./DragAndDropZone";

const { getByText } = screen;

const DEFAULT_CHILDREN = "Test children";
const DEFAULT_CLASSES = "rounded-xl border-dashed";
const DRAG_OVER_CLASSES = "border-2";

describe("<DragAndDropZone />", () => {
  it.each(["A children", "Another children"])(
    "should render %p",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render default classes", () => {
    getRenderer();
    expect(getByText(DEFAULT_CHILDREN)).toHaveClass(DEFAULT_CLASSES);
  });

  it.each(["a-class", "another-class"])(
    "should render custom class %p",
    (expected) => {
      getRenderer({ className: expected });
      expect(getByText(DEFAULT_CHILDREN)).toHaveClass(
        `${DEFAULT_CLASSES} ${expected}`
      );
    }
  );

  it("should render correct class on drag over event", () => {
    getRenderer();

    const dropZone = getByText(DEFAULT_CHILDREN);
    expect(dropZone).not.toHaveClass(DRAG_OVER_CLASSES);

    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass(DRAG_OVER_CLASSES);
  });

  it("should render correct class on drag leave event", () => {
    getRenderer();
    const dropZone = getByText(DEFAULT_CHILDREN);
    fireEvent.dragOver(dropZone);

    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass(DRAG_OVER_CLASSES);
  });

  it("should render correct class on drag drop event", () => {
    getRenderer();
    const dropZone = getByText(DEFAULT_CHILDREN);
    fireEvent.dragOver(dropZone);

    fireEvent.drop(dropZone);
    expect(dropZone).not.toHaveClass(DRAG_OVER_CLASSES);
  });

  it("should call handleFiles callback correctly", () => {
    const handleFiles = jest.fn();
    getRenderer({ handleFiles });

    const dropZone = getByText(DEFAULT_CHILDREN);
    const file = new File(["test-content"], "test-name", { type: "txt" });
    expect(handleFiles).not.toHaveBeenCalled();

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    expect(handleFiles).toHaveBeenCalledTimes(1);
  });

  it("should NOT call handleFiles callback", () => {
    const handleFiles = jest.fn();
    getRenderer({ handleFiles });

    const dropZone = getByText(DEFAULT_CHILDREN);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [],
      },
    });
    expect(handleFiles).not.toHaveBeenCalled();
  });
});

// Helpers
type Props = ComponentProps<typeof DragAndDropZone>;
function getRenderer({
  children = DEFAULT_CHILDREN,
  handleFiles = jest.fn(),
  ...rest
}: Partial<Props> = {}) {
  return render(
    <DragAndDropZone handleFiles={handleFiles} {...rest}>
      {children}
    </DragAndDropZone>
  );
}
