import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { ProductDescription } from "~/domain/models/products/ProductModel";
import { CheckoutProductCard } from "./CheckoutProductCard";

const ADD_TO_CART_BUTTON_LABEL = "Add to cart";
const MORE_INFO_BUTTON_LABEL = "More info";
const YEAR_LABEL = "/year";

const { getByRole, getByText, queryByText } = screen;

describe("CheckoutProductCard", () => {
  it.each(["My offer", "Test offer"])(
    "should render component with given title %p",
    (title) => {
      getRenderer({ product: mockProductItem({ title }) });
      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["9", "100"])(
    "should render component with given price $%i",
    (price) => {
      getRenderer({
        product: mockProductItem({
          availableOptions: { default: { id: "default", price } },
        }),
      });
      expect(getByText(`$${price}`)).toBeInTheDocument();
    }
  );

  it.each(["Product 1", "Product 2"])(
    "should render component with given product %p",
    (product) => {
      getRenderer({ product: mockProductItem({ title: product }) });
      expect(getByText(product)).toBeInTheDocument();
    }
  );

  it.each(["Random description", "Test description"])(
    "should render component with given description %p",
    (productSpecifications) => {
      getRenderer({
        product: mockProductItem({ description: productSpecifications }),
      });
      expect(getByText(productSpecifications)).toBeInTheDocument();
    }
  );

  it(`should render component with ${YEAR_LABEL} when isAnnual is defined`, () => {
    getRenderer({ isAnnual: true });
    expect(getByText(YEAR_LABEL)).toBeInTheDocument();
  });

  it(`should NOT render component with ${YEAR_LABEL} when isAnnual is not defined`, () => {
    getRenderer({ isAnnual: false });
    expect(queryByText(YEAR_LABEL)).not.toBeInTheDocument();
  });

  it("should render the add cart button", () => {
    getRenderer();
    expect(
      getByRole("button", { name: ADD_TO_CART_BUTTON_LABEL })
    ).toBeInTheDocument();
  });

  it("should render the more info button", () => {
    getRenderer();
    expect(
      getByRole("button", { name: MORE_INFO_BUTTON_LABEL })
    ).toBeInTheDocument();
  });

  it("should call onClickAddToCart callback when user clicks on add cart button", async () => {
    const onClickAddToCart = jest.fn();
    getRenderer({ onClickAddToCart });
    expect(onClickAddToCart).not.toHaveBeenCalled();
    await userEvent.click(
      getByRole("button", { name: ADD_TO_CART_BUTTON_LABEL })
    );
    expect(onClickAddToCart).toHaveBeenCalledTimes;
  });

  it("should call onClickMoreInfo callback when user clicks on more info button", async () => {
    const onClickMoreInfo = jest.fn();
    getRenderer({ onClickMoreInfo });
    expect(onClickMoreInfo).not.toHaveBeenCalled();
    await userEvent.click(
      getByRole("button", { name: MORE_INFO_BUTTON_LABEL })
    );
    expect(onClickMoreInfo).toHaveBeenCalledTimes(1);
  });
});

// Test helpers
function getRenderer({
  isAnnual,
  onChange = jest.fn(),
  onClickAddToCart = jest.fn(),
  onClickMoreInfo = jest.fn(),
  product = mockProductItem(),
  selectedColorSize = "",
}: Partial<ComponentProps<typeof CheckoutProductCard>> = {}) {
  return render(
    <CheckoutProductCard
      product={product}
      isAnnual={isAnnual}
      onChange={onChange}
      onClickAddToCart={onClickAddToCart}
      onClickMoreInfo={onClickMoreInfo}
      selectedColorSize={selectedColorSize}
    />
  );
}

function mockProductItem(
  props?: Partial<ProductDescription>
): ProductDescription {
  return {
    availableColors: [],
    availableSizes: [],
    availableOptions: { default: { id: "default", price: "19.95" } },
    id: "item-id",
    title: "Item title",
    description: "Item description",
    images: [],
    type: "item-type",
    ...props,
  };
}
