import { render, screen } from "@testing-library/react";
import { CheckoutFooter } from "./CheckoutFooter";
import { BrowserRouter } from "react-router-dom";

const { getByRole, getByText } = screen;

const FOOTER_CLASSES = "h-[261px] lg:h-[224px]";

describe("CheckoutFooter", () => {
  it("should render as a semantic role=region", () => {
    getRenderer();
    const footerElement = getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
    expect(footerElement.tagName).toBe("FOOTER");
  });

  it("should render the imag with its alt attribute", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("alt", "PetPlace logo");
  });

  it(`should render with specific class=${FOOTER_CLASSES} to assure that height will be correctly on different screens`, () => {
    getRenderer();

    const footerElement = getByRole("contentinfo");
    expect(footerElement).toHaveClass(FOOTER_CLASSES);
  });

  it("should render footer with copyright text", () => {
    getRenderer();
    expect(
      getByText(
        "©Copyright 1999 - 2023. Independence American Holdings Corp. All Rights Reserved"
      )
    ).toBeInTheDocument();
  });

  it("should render links to terms of use and privacy", () => {
    getRenderer();
    expect(getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "https://www.petplace.com/privacy-policy"
    );
    expect(getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "https://www.petplace.com/terms-of-use"
    );
  });
});

function getRenderer() {
  return render(
    <BrowserRouter>
      <CheckoutFooter />
    </BrowserRouter>
  );
}
