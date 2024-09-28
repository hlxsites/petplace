import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { CheckoutProductColorSize } from "./CheckoutProductColorSize";

const { getByText, queryByText, getByRole } = screen;

describe("CheckoutProductColorSize", () => {
  it("should renders color and size options when both props are provided", () => {
    getRenderer({
      availableColors: ["black"],
      availableSizes: ["L"],
    });

    expect(getByText("Color choice:")).toBeInTheDocument();
    expect(getByText("Select a size:")).toBeInTheDocument();
  });

  it("should NOT render color and size options when props are not defined", () => {
    getRenderer({ availableColors: undefined, availableSizes: undefined });

    expect(queryByText("Color choice:")).not.toBeInTheDocument();
    expect(queryByText("Select a size:")).not.toBeInTheDocument();
  });

  it("should render color button with aria-label", () => {
    getRenderer({ availableColors: ["black"] });

    expect(getByRole("button")).toHaveAttribute("aria-label", "color: black");
  });

  it.each(["black", "white"])(
    "should render with selected color %p",
    (color) => {
      getRenderer({
        availableColors: ["black", "white"],
        selectedColor: color,
      });
      expect(
        getByRole("button", { name: `selected color: ${color}` })
      ).toBeInTheDocument();
    }
  );

  it.each(["black", "white"])(
    "should allow user to select color %p",
    async (color) => {
      const onChange = jest.fn();
      getRenderer({ availableColors: ["black", "white"], onChange });
      expect(onChange).not.toHaveBeenCalled();

      await userEvent.click(getByRole("button", { name: `color: ${color}` }));
      expect(onChange).toHaveBeenCalledWith({ color, size: "" });
    }
  );

  it.each(["S", "L", "S/M"])("should render with selected size %p", (size) => {
    getRenderer({
      availableSizes: ["S", "L", "S/M"],
      selectedSize: size,
    });
    expect(
      getByRole("button", { name: `selected size: ${size}` })
    ).toBeInTheDocument();
  });

  it.each(["L", "S/M"])("should allow user to select size %p", async (size) => {
    const onChange = jest.fn();
    getRenderer({
      availableSizes: ["S", "L", "S/M"],
      onChange,
      selectedSize: "S",
    });
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button", { name: `size: ${size}` }));
    expect(onChange).toHaveBeenCalledWith({ color: "", size });
  });
});

function getRenderer({
  availableColors = [],
  availableSizes = [],
  onChange = jest.fn(),
  selectedColor = "",
  selectedSize = "",
}: Partial<ComponentProps<typeof CheckoutProductColorSize>> = {}) {
  return render(
    <CheckoutProductColorSize
      availableColors={availableColors}
      availableSizes={availableSizes}
      onChange={onChange}
      selectedColor={selectedColor}
      selectedSize={selectedSize}
    />
  );
}
