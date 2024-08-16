import { render, screen } from "@testing-library/react";
import { CheckoutHeader } from "./CheckoutHeader";

const { getByRole } = screen;

const HEADER_CLASSES =
  "m-0 h-[106px] w-full bg-white px-base pt-[59px] lg:h-[88px] lg:px-xxlarge lg:py-base";

describe("CheckoutHeader", () => {
  it("should render as a semantic header", () => {
    getRenderer();
    const headerElement = getByRole("banner");
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.tagName).toBe("HEADER");
  });

  it("should render the imag with its alt attribute", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("alt", "PetPlace logo");
  });

  it(`should render with specific class=${HEADER_CLASSES} to assure that padding will be correctly on different screens`, () => {
    getRenderer();

    const header = getByRole("banner");
    expect(header).toHaveClass(HEADER_CLASSES);
  });
});

function getRenderer() {
  return render(<CheckoutHeader />);
}
