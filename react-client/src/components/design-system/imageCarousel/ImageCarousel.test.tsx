import { fireEvent, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { ImageCarousel } from "./ImageCarousel";

const { getByLabelText, getAllByRole, getByRole } = screen;

const DEFAULT_LABEL = "Test label";

describe("ImageCarousel", () => {
  it("should render", () => {
    getRenderer();
    expect(getByLabelText(DEFAULT_LABEL)).toBeInTheDocument();
  });

  it.each([["src-one"], ["src-one", "src-two", "src-three"]])(
    "should render a number of images equal to the amount of items",
    (...sources) => {
      const items = sources.map((src) => ({ src }));
      getRenderer({ items });
      expect(getAllByRole("img").length).toBe(items.length);
    }
  );

  it.each([["src-one"], ["src-one", "src-two", "src-three"]])(
    "should render a number of indicators equal to the amount of items",
    (...sources) => {
      const items = sources.map((src) => ({ src }));
      const { container } = getRenderer({ items });
      const indicators = [
        ...container.querySelectorAll(
          "svg[data-file-name='SvgEllipseWithStrokeIcon']"
        ),
      ];
      expect(indicators.length).toBe(items.length);
    }
  );

  it("should render current image correctly when navigating through keyboard", () => {
    const items = ["src-one", "src-two", "src-three"].map((src) => ({ src }));
    getRenderer({ items });
    const carouselDiv = getByLabelText(DEFAULT_LABEL).firstChild?.firstChild;
    if (!carouselDiv) return;

    fireEvent.keyDown(carouselDiv, { key: "ArrowRight" });
    expect(carouselDiv).toHaveStyle(`transform: translateX(-100%)`);

    fireEvent.keyDown(carouselDiv, { key: "ArrowLeft" });
    fireEvent.keyDown(carouselDiv, { key: "ArrowLeft" });
    expect(carouselDiv).toHaveStyle(`transform: translateX(-200%)`);
  });

  it.each([
    { src: "some-src", alt: "alt text" },
    { src: "other-src", alt: "another text" },
  ])("should render image with correct src and alt text", ({ src, alt }) => {
    getRenderer({ items: [{ src, alt }] });
    expect(getByRole("img")).toHaveAttribute("src", src);
    expect(getByRole("img")).toHaveAttribute("alt", alt);
  });
});

function getRenderer({
  ariaLabel = DEFAULT_LABEL,
  items = [],
}: Partial<ComponentProps<typeof ImageCarousel>> = {}) {
  return render(<ImageCarousel ariaLabel={ariaLabel} items={items} />);
}
