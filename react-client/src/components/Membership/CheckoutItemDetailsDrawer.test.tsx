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
  item = MOCK_ITEM,
  onClose = jest.fn(),
  ...rest
}: Partial<ComponentProps<typeof CheckoutItemDetailsDrawer>> = {}) {
  return render(
    <CheckoutItemDetailsDrawer item={item} onClose={onClose} {...rest} />
  );
}

const MOCK_ITEM: DetailedCartItem = {
  id: "test-item",
  title: "Test Item",
  price: "$100",
  images: ["test-image.jpg"],
  description: "Test Description",
};
const MOCK_ON_ADD_TO_CART = jest.fn();
