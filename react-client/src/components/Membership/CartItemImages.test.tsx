import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { CartItemImages } from "./CartItemImages";

const { getByAltText, getByLabelText } = screen;

describe("CartItemImages", () => {
  it("should render a single image when images array has one item", () => {
    getRenderer({ images: MOCK_IMAGE, name: "Test Product" });

    const img = getByAltText("product: Test Product");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "image1.jpg");
  });

  it("should render ImageCarousel when images array has multiple items", () => {
    getRenderer({
      images: [...MOCK_IMAGE, "image2.jpg"],
      name: "Test Product",
    });

    const carousel = getByLabelText("Images of product: Test Product");
    expect(carousel).toBeInTheDocument();
  });

  it("should return null when images array is an empty array", () => {
    const { container } = getRenderer({ images: [] });
    expect(container.firstChild).toBeNull();
  });

  it("should render alt text as 'Product image' when name is not provided", () => {
    getRenderer({ images: MOCK_IMAGE });

    const img = getByAltText("Product image");
    expect(img).toBeInTheDocument();
  });
});

function getRenderer({
  images = [],
  ...rest
}: Partial<ComponentProps<typeof CartItemImages>> = {}) {
  return render(<CartItemImages images={images} {...rest} />);
}

const MOCK_IMAGE = ["image1.jpg"];
