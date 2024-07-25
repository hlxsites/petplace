import { render, screen } from "@testing-library/react";
import { Loading } from "./Loading";

const { getByRole } = screen;

describe("Loading", () => {
  const srOnlyText = /wait until load is complete/i;

  it("should render the SVG loadingIcon", () => {
    getRenderer();
    expect(document.querySelector("svg")).toHaveAttribute(
      "name",
      "loadingIcon"
    );
  });

  it("should render component with spin animation applied", () => {
    getRenderer();
    expect(document.querySelector("svg")).toHaveAttribute(
      "class",
      "animate-spin"
    );
  });

  it("should render text component with srOnly class applied", () => {
    getRenderer();
    expect(getByRole("paragraph")).toHaveClass("sr-only");
  });

  it(`should make the text: ${srOnlyText} available for screen readers`, () => {
    getRenderer();
    expect(getByRole("paragraph")).toHaveTextContent(srOnlyText);
  });
});

function getRenderer() {
  return render(<Loading />);
}
