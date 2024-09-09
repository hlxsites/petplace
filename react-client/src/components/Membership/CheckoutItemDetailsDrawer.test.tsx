import { render, screen } from "@testing-library/react";
import { CheckoutItemDetailsDrawer } from "./CheckoutItemDetailsDrawer";
import { ComponentProps } from "react";
import { DetailedCartItem } from "~/mocks/MockRestApiServer";
import userEvent from "@testing-library/user-event";

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

    const content = getByText(MOCK_ITEM.name);
    expect(content).toBeInTheDocument();
    expect(getByText(MOCK_ITEM.description)).toBeInTheDocument();
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
  name: "Test Item",
  price: "$100",
  images: [{ src: "test-image.jpg", alt: "Test Image" }],
  description: "Test Description",
};
const MOCK_ON_ADD_TO_CART = jest.fn();
