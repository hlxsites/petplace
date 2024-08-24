import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("should be disabled when disabled is true", () => {
    getRenderer({ disabled: true });
    expect(getByRole("button")).toBeDisabled();
  });

  it("should call onClick callbacks", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });
    expect(onClick).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([true, false])(
    "should match snapshot of both enabled and disable button",
    (expected) => {
      const { container } = getRenderer({ disabled: expected });

      expect(container).toMatchSnapshot();
    }
  );
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
