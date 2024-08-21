import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CartHeader } from "./CartHeader";

const { getByText } = screen;

describe("CartHeader", () => {
  it("should render title", () => {
    getRenderer();
    expect(getByText("My Cart")).toBeInTheDocument();
  });

  it("should render correct icon", () => {
    const { container } = getRenderer();
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgShoppingCartIcon"
    );
  });
});

function getRenderer() {
  return render(<CartHeader />);
}
