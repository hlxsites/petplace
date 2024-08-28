import { render, screen } from "@testing-library/react";
import { CartItemImages } from "./CartItemImages";
import { ComponentProps } from "react";
import { Image } from "~/mocks/MockRestApiServer";

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
      images: [...MOCK_IMAGE, { src: "image2.jpg", alt: "Image 2" }],
      name: "Test Product",
    });

    const carousel = getByLabelText("Images of product: Test Product");
    expect(carousel).toBeInTheDocument();
  });

  it.each([[], {} as any])(
    "should return null when images array is empty",
    (images) => {
      const { container } = getRenderer({ images });
      expect(container.firstChild).toBeNull();
    }
  );

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

const MOCK_IMAGE: Image[] = [{ src: "image1.jpg", alt: "Image 1" }];
