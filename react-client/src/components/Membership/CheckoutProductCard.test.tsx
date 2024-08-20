import { render, screen } from "@testing-library/react";
import { CheckoutProductCard } from "./CheckoutProductCard";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

const ADD_TO_CART_BUTTON_LABEL = "Add to cart";
const MORE_INFO_BUTTON_LABEL = "More info";
const YEAR_LABEL = "/year";

const { getByRole, getByText, queryByText } = screen;

describe("CheckoutProductCard", () => {
  it.each(["My offer", "Test offer"])(
    "should render component with given title",
    (title) => {
      getRenderer({ title });
      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["9", "100"])("should render component with given price", (price) => {
    getRenderer({ price });
    expect(getByText(price)).toBeInTheDocument();
  });

  it.each(["Product 1", "Product 2"])(
    "should render component with given product",
    (product) => {
      getRenderer({ product: <p>{product}</p> });
      expect(getByText(product)).toBeInTheDocument();
    }
  );

  it.each(["Random specification", "Test specification"])(
    "should render component with given productSpecifications",
    (productSpecifications) => {
      getRenderer({ productSpecifications: <p>{productSpecifications}</p> });
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

  it(`should render the buttons ${ADD_TO_CART_BUTTON_LABEL} and ${MORE_INFO_BUTTON_LABEL}`, () => {
    getRenderer();
    expect(
      getByRole("button", { name: ADD_TO_CART_BUTTON_LABEL })
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: MORE_INFO_BUTTON_LABEL })
    ).toBeInTheDocument();
  });

  it("should call onClick callback when user clicks on a button", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });
    expect(onClick).not.toHaveBeenCalled();
    await userEvent.click(
      getByRole("button", { name: MORE_INFO_BUTTON_LABEL })
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

function getRenderer({
  price = "99.99",
  product = <p>Test</p>,
  title = "Product Offer",
  ...rest
}: Partial<ComponentProps<typeof CheckoutProductCard>> = {}) {
  return render(
    <CheckoutProductCard
      price={price}
      product={product}
      title={title}
      {...rest}
    />
  );
}
