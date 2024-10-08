import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { Backdrop } from "./Backdrop";

const { getByTestId, queryByTestId } = screen;

const TEST_ID = "backdrop";

describe("<Backdrop />", () => {
  it("should render the backdrop", () => {
    getRenderer();
    expect(getByTestId(TEST_ID)).toBeInTheDocument();
  });

  it("should render the backdrop with initial animation classes", () => {
    getRenderer();
    expect(getByTestId(TEST_ID)).toHaveClass(
      "fixed inset-0 z-40 backdrop-blur-sm animate-fadeIn bg-black/30"
    );
  });

  it("should not render the backdrop", () => {
    getRenderer({ isOpen: false });
    expect(queryByTestId(TEST_ID)).not.toBeInTheDocument();
  });

  it("should call onClick callback when clicked on it", async () => {
    const onClick = jest.fn();

    getRenderer({ onClick });
    expect(onClick).not.toHaveBeenCalled();

    await userEvent.click(getByTestId(TEST_ID));
    await userEvent.click(getByTestId(TEST_ID));
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

// Helpers
type Props = ComponentProps<typeof Backdrop>;
function getRenderer({ isOpen = true, ...rest }: Partial<Props> = {}) {
  return render(<Backdrop {...rest} isOpen={isOpen} />);
}
