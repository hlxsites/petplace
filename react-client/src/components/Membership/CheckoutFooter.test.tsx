import { render, screen } from "@testing-library/react";
import { CheckoutFooter } from "./CheckoutFooter";

const { getByRole } = screen;

describe("CheckoutFooter", () => {
  it("should render as a semantic footer", () => {
    getRenderer();
    const headerElement = getByRole("contentinfo");
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.tagName).toBe("FOOTER");
  });

  it("should render footer with specific link to petPlace website", () => {
    getRenderer();
    expect(getByRole("link", { name: "PetPlace.com" })).toHaveAttribute(
      "href",
      "https://petplace.com"
    );
  });
});

function getRenderer() {
  return render(<CheckoutFooter />);
}
