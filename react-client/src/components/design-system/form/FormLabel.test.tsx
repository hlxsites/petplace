import { render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import FormLabel from "./FormLabel";

const { getByTestId, getByText } = screen;

describe("<FormLabel />", () => {
  it("should have default test id", () => {
    getRenderer();
    expect(getByTestId("FormLabel")).toBeInTheDocument();
  });

  it.each(["a-class", "another-class"])(
    "should render with className %p",
    (expected) => {
      getRenderer({ className: expected });
      expect(getByTestId("FormLabel")).toHaveClass(
        `text-base font-medium ${expected}`
      );
    }
  );

  it.each(["Children", "Another children"])(
    "should render with children %p",
    (expected) => {
      getRenderer({ children: <p>{expected}</p> });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );
});

// Helpers
function getRenderer({
  children = "The children",
  ...rest
}: Partial<ComponentProps<typeof FormLabel>> = {}) {
  return render(<FormLabel {...rest}>{children}</FormLabel>);
}
