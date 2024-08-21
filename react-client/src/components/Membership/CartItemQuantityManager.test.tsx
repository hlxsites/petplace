import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { CartItemQuantityManager } from "./CartItemQuantityManager";

const { getByText, getByLabelText } = screen;

const DEFAULT_QUANTITY = 5;
const DEFAULT_ID = "test-id";

describe("CartItemQuantityManager", () => {
  it.each([3, 6, 8])("should render correct %s quantity", (expected) => {
    getRenderer({ quantity: expected });
    expect(getByText(expected)).toBeInTheDocument();
  });

  it.each([
    ["Remove one", "RemoveCircle"],
    ["Add one", "AddCircle"],
  ])("should render %s button correct %s icon", (label, expected) => {
    getRenderer();
    expect(getByLabelText(label).querySelector("svg")).toHaveAttribute(
      "data-file-name",
      `Svg${expected}Icon`
    );
  });

  it("should disable the remove button when quantity is 1", () => {
    getRenderer({ quantity: 1 });
    expect(getByLabelText("Remove one")).toBeDisabled();
  });

  it("should disable the add button when quantity is equal purchase limit", () => {
    getRenderer({ purchaseLimit: DEFAULT_QUANTITY });
    expect(getByLabelText("Add one")).toBeDisabled();
  });

  it("should call updateQuantity with decremented value when remove button is clicked", async () => {
    const updateQuantity = jest.fn();
    getRenderer({ updateQuantity });
    await userEvent.click(getByLabelText("Remove one"));
    expect(updateQuantity).toHaveBeenCalledWith(
      DEFAULT_ID,
      DEFAULT_QUANTITY - 1
    );
  });

  it("should call updateQuantity with incremented value when add button is clicked", async () => {
    const updateQuantity = jest.fn();
    getRenderer({ updateQuantity });
    await userEvent.click(getByLabelText("Add one"));
    expect(updateQuantity).toHaveBeenCalledWith(
      DEFAULT_ID,
      DEFAULT_QUANTITY + 1
    );
  });
});

function getRenderer({
  id = DEFAULT_ID,
  quantity = DEFAULT_QUANTITY,
  updateQuantity = jest.fn(),
  ...props
}: Partial<ComponentProps<typeof CartItemQuantityManager>> = {}) {
  return render(
    <CartItemQuantityManager
      id={id}
      quantity={quantity}
      updateQuantity={updateQuantity}
      {...props}
    />
  );
}
