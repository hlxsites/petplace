import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { DetailedCartItem } from "~/domain/models/products/ProductModel";
import { CheckoutItemDetailsDrawer } from "./CheckoutItemDetailsDrawer";

const { getByLabelText, getByText } = screen;

describe("CheckoutItemDetailsDrawer", () => {
  it("should render the Drawer with the correct ariaLabel and id", () => {
    getRenderer();

    const drawer = getByLabelText("Product info drawer");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("id", MOCK_ITEM.id);
  });

  it("should render content with the correct props", () => {
    getRenderer();

    const content = getByText(MOCK_ITEM.title);
    expect(content).toBeInTheDocument();
    //  TODO: review this test
    // expect(getByText(MOCK_ITEM.description)).toBeInTheDocument();
  });

  it("should call onAddToCart callback", async () => {
    getRenderer({ onAddToCart: MOCK_ON_ADD_TO_CART });

    const addToCartButton = screen.getByRole("button", {
      name: /Add to Cart/i,
    });

    await userEvent.click(addToCartButton);
    expect(MOCK_ON_ADD_TO_CART).toHaveBeenCalledTimes(1);
  });
});

function getRenderer({
  product = MOCK_ITEM,
  onClose = jest.fn(),
  onAddToCart = jest.fn(),
  onChange = jest.fn(),
  selectedColorSize = "black | L",
}: Partial<ComponentProps<typeof CheckoutItemDetailsDrawer>> = {}) {
  return render(
    <CheckoutItemDetailsDrawer
      product={product}
      onClose={onClose}
      onAddToCart={onAddToCart}
      onChange={onChange}
      selectedColorSize={selectedColorSize}
    />
  );
}

const MOCK_ITEM: DetailedCartItem = {
  availableColors: [],
  availableSizes: [],
  availableOptions: {},
  id: "test-item",
  title: "Test Item",
  images: ["test-image.jpg"],
  description: "Test Description",
  type: "test-type",
};
const MOCK_ON_ADD_TO_CART = jest.fn();
