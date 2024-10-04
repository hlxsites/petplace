import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { CartFooter } from "./CartFooter";

const { getByText, getByRole } = screen;

describe("CartFooter", () => {
  it("should render subtotal text", () => {
    getRenderer();
    expect(getByText("Subtotal")).toBeInTheDocument();
  });

  it("should render taxes text", () => {
    getRenderer();
    expect(
      getByText("Applicable taxes will be applied at checkout")
    ).toBeInTheDocument();
  });

  it.each(["123.45", "11.69"])(
    "should render correct %s subtotal value",
    (expected) => {
      getRenderer({ subtotal: expected });
      expect(getByText(`$${expected}`)).toBeInTheDocument();
    }
  );

  it("should call onClick callback when clicking on proceed to checkout button", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });

    await userEvent.click(getByRole("button", { name: "Proceed to checkout" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("should enable button when isSubmittingCart is false", () => {
    getRenderer({ isSubmittingCart: false });
    expect(getByRole("button", { name: "Proceed to checkout" })).toBeEnabled();
  });

  it("should disable button when isSubmittingCart is true", () => {
    getRenderer({ isSubmittingCart: true });
    expect(getByRole("button", { name: "Proceed to checkout" })).toBeDisabled();
  });
});

function getRenderer({
  isSubmittingCart = false,
  onClick = jest.fn(),
  subtotal = "123.45",
}: Partial<ComponentProps<typeof CartFooter>> = {}) {
  return render(
    <CartFooter
      subtotal={subtotal}
      onClick={onClick}
      isSubmittingCart={isSubmittingCart}
    />
  );
}
