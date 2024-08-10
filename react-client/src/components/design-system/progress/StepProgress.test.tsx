import { render, screen } from "@testing-library/react";
import { StepProgress, StepProgressProps } from "./StepProgress";

const { getByText, getAllByLabelText, getByRole, queryByRole } = screen;

const DEFAULT_COUNT = 5;
const DEFAULT_CURRENT = 2;

describe("<StepProgress />", () => {
  it("should render the stepProgress", () => {
    getRenderer();
    expect(
      getByText(`${DEFAULT_CURRENT} of ${DEFAULT_COUNT}`)
    ).toBeInTheDocument();
  });

  it("should render the accessibility props", () => {
    getRenderer();
    expect(getByRole("group")).toHaveAttribute(
      "aria-label",
      "Progress Indicators"
    );
  });

  it.each([2, 4, 7])("should render %i icons", (expected) => {
    const { container } = getRenderer({ count: expected });
    expect(container.querySelectorAll("svg").length).toBe(expected);
  });

  it.each([1, 3, 5])("should render %i filled icons", (expected) => {
    const { container } = getRenderer({ current: expected });
    const filledIcons = container.querySelectorAll(
      'svg[data-file-name="SvgEllipseIcon"]'
    );
    expect(filledIcons.length).toBe(expected);
  });

  it("should render 2 completed steps with accessibility", () => {
    getRenderer();
    expect(getAllByLabelText("Completed Step").length).toBe(2);
  });

  it("should render 3 uncompleted steps with accessibility", () => {
    getRenderer();
    expect(getAllByLabelText("Uncompleted Step").length).toBe(3);
  });

  it("should not render when count is 0", () => {
    getRenderer({ count: 0 });
    expect(queryByRole("group")).not.toBeInTheDocument();
  });
});

function getRenderer({
  count = DEFAULT_COUNT,
  current = DEFAULT_CURRENT,
}: Partial<StepProgressProps> = {}) {
  return render(<StepProgress count={count} current={current} />);
}
