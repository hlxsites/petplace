import { render, screen } from "@testing-library/react";
import { CheckoutInfoSection } from "./CheckoutInfoSection";

const { getByRole } = screen;

describe("CheckoutInfoSection", () => {
  it("should render as a semantic role=region", () => {
    getRenderer();

    expect(getByRole("region")).toBeInTheDocument();
  });
});

function getRenderer() {
  return render(<CheckoutInfoSection />);
}
