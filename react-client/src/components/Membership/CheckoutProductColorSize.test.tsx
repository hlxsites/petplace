import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { CheckoutProductColorSize } from "./CheckoutProductColorSize";

const { getByText, queryByText, getByRole, getAllByRole } = screen;

describe("CheckoutProductColorSize", () => {
  it("should renders color and size options when both props are provided", () => {
    getRenderer({
      productColors: ["black"],
      productSizes: ["L"],
    });

    expect(getByText("Color choice:")).toBeInTheDocument();
    expect(getByText("Select a size:")).toBeInTheDocument();
  });

  it("should NOT render color and size options when props are not defined", () => {
    getRenderer({ productColors: undefined, productSizes: undefined });

    expect(queryByText("Color choice:")).not.toBeInTheDocument();
    expect(queryByText("Select a size:")).not.toBeInTheDocument();
  });

  it("should render color button with aria-label", () => {
    getRenderer({ productColors: ["black"] });

    expect(getByRole("button")).toHaveAttribute("aria-label", "color: black");
  });

  it("should allow user to select color", async () => {
    getRenderer({ productColors: ["black"] });

    expect(getByRole("button")).not.toHaveClass("border-orange-300-main");
    await userEvent.click(getByRole("button"));
    expect(getByRole("button")).toHaveClass("border-orange-300-main");
  });

  it("should allow user to select sizes options", async () => {
    getRenderer({
      productSizes: ["L", "S/M"],
    });
    const buttons = getAllByRole("button");

    expect(buttons[0]).not.toHaveClass(
      "border-orange-300-contrast text-orange-300-contrast"
    );
    expect(buttons[1]).not.toHaveClass(
      "border-orange-300-contrast text-orange-300-contrast"
    );

    await userEvent.click(buttons[0]);
    expect(buttons[0]).toHaveClass(
      "border-orange-300-contrast text-orange-300-contrast"
    );
    expect(buttons[1]).not.toHaveClass(
      "border-orange-300-contrast text-orange-300-contrast"
    );

    await userEvent.click(buttons[1]);
    expect(buttons[0]).not.toHaveClass(
      "border-orange-300-contrast text-orange-300-contrast"
    );
    expect(buttons[1]).toHaveClass(
      "border-orange-300-contrast text-orange-300-contrast"
    );
  });
});

function getRenderer({
  ...props
}: Partial<ComponentProps<typeof CheckoutProductColorSize>> = {}) {
  return render(<CheckoutProductColorSize {...props} />);
}
