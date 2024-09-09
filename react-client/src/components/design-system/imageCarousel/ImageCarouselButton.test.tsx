import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { IconButtonTypes, ImageCarouselButton } from "./ImageCarouselButton";

const { getByRole } = screen;

describe("ImageCarouselButton", () => {
  it.each([
    ["previous", "Previous Slide"],
    ["next", "Next Slide"],
  ])("should render accessible %s button", (type, expected) => {
    getRenderer({ type: type as IconButtonTypes });
    expect(getByRole("button", { name: expected })).toBeInTheDocument();
  });

  it.each([
    ["previous", "ChevronLeft"],
    ["next", "ChevronRight"],
  ])("should render expected %s icon: %s", (type, expected) => {
    getRenderer({ type: type as IconButtonTypes });
    expect(getByRole("button").querySelector("svg")).toHaveAttribute(
      "data-file-name",
      `Svg${expected}Icon`
    );
  });

  it("should be enabled by default", () => {
    getRenderer();
    expect(getByRole("button")).toBeEnabled();
  });

  it("should be disabled when disabled is true", () => {
    getRenderer({ disabled: true });
    expect(getByRole("button")).toBeDisabled();
  });

  it("should render button with expected classes when is enabled", () => {
    getRenderer({ disabled: false });
    expect(
      getByRole("button").querySelector(
        "svg[data-file-name='SvgChevronLeftIcon']"
      )?.parentElement
    ).toHaveClass("text-orange-300-contrast");
  });

  it("should render button with expected classes when is disabled", () => {
    getRenderer({ disabled: true });
    expect(
      getByRole("button").querySelector(
        "svg[data-file-name='SvgChevronLeftIcon']"
      )?.parentElement
    ).toHaveClass("text-neutral-400");
  });
});

function getRenderer({
  type = "previous",
  onClick = jest.fn(),
  ...rest
}: Partial<ComponentProps<typeof ImageCarouselButton>> = {}) {
  return render(
    <ImageCarouselButton type={type} onClick={onClick} {...rest} />
  );
}
