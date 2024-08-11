import { render, screen } from "@testing-library/react";
import { StepProgress, StepProgressProps } from "./StepProgress";

const { getByTestId, getByText, queryByTestId } = screen;

const TEST_ID = "StepProgress";
const DEFAULT_COUNT = 5;
const DEFAULT_CURRENT = 2;

describe("<StepProgress />", () => {
  it("should render with testid", () => {
    getRenderer();
    expect(getByTestId(TEST_ID)).toBeInTheDocument();
  });

  it("should not render when count is 0", () => {
    getRenderer({ count: 0 });
    expect(queryByTestId(TEST_ID)).not.toBeInTheDocument();
  });

  it.each([0, 1])('should render "1 of 5" when current=%i ', (current) => {
    getRenderer({ current });
    expect(getByText("1 of 5")).toBeInTheDocument();
  });

  it.each([2, 3, 4, 5])(
    'should render "2 of 5" when current=%i ',
    (current) => {
      getRenderer({ current });
      expect(getByText(`${current} of 5`)).toBeInTheDocument();
    }
  );

  it('should render "1 of 1" when count=1 and current=2 ', () => {
    getRenderer({ count: 1, current: 2 });
    expect(getByText("1 of 1")).toBeInTheDocument();
  });

  it('should render "10 of 10" when count=10 and current=20 ', () => {
    getRenderer({ count: 10, current: 20 });
    expect(getByText("10 of 10")).toBeInTheDocument();
  });
});

function getRenderer({
  count = DEFAULT_COUNT,
  current = DEFAULT_CURRENT,
}: Partial<StepProgressProps> = {}) {
  return render(<StepProgress count={count} current={current} />);
}
