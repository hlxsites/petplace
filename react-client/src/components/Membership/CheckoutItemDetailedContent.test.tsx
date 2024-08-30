import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { CheckoutItemDetailedContent } from "./CheckoutItemDetailedContent";

const ADD_TO_CART_BUTTON_LABEL = "Add to cart";
const YEAR_LABEL = "/year";
const DEFAULT_ITEM = {
  id: "item-id",
  name: "Item name",
  price: "Item price",
  description: "Item description",
  images: [],
};

const { getByRole, getByText, queryByText, queryByRole } = screen;

describe("CheckoutItemDetailedContent", () => {
  it.each(["A product", "Another product"])(
    "should render component with given name",
    (name) => {
      getRenderer({ item: { ...DEFAULT_ITEM, name } });
      expect(getByRole("heading", { name })).toBeInTheDocument();
    }
  );

  it.each(["$19.95", "$100.00"])(
    "should render component with given price",
    (price) => {
      getRenderer({ item: { ...DEFAULT_ITEM, price } });
      expect(getByText(price)).toBeInTheDocument();
    }
  );

  it.each(["A description", "Another description"])(
    "should render component with given description",
    (description) => {
      getRenderer({ item: { ...DEFAULT_ITEM, description } });
      expect(getByText(description)).toBeInTheDocument();
    }
  );

  it.each(["An additional info", "Another additional info"])(
    "should render component with given info",
    (additionalInfo) => {
      getRenderer({ item: { ...DEFAULT_ITEM, additionalInfo } });
      expect(getByText(additionalInfo)).toBeInTheDocument();
    }
  );

  it.each(["A feature", "Another feature"])(
    "should render component with given privacy features",
    (privacyFeatures) => {
      getRenderer({ item: { ...DEFAULT_ITEM, privacyFeatures } });
      expect(getByText(privacyFeatures)).toBeInTheDocument();
    }
  );

  it.each(["A size", "Another size"])(
    "should render component with given sizing",
    (sizing) => {
      getRenderer({ item: { ...DEFAULT_ITEM, sizing } });
      expect(getByText(sizing)).toBeInTheDocument();
    }
  );

  it.each([
    ["An unique tag feature"],
    ["A tag feature", "Another tag feature"],
  ])("should render component with given tag features", (...tagFeatures) => {
    getRenderer({ item: { ...DEFAULT_ITEM, tagFeatures } });
    expect(getByRole("list")).toBeInTheDocument();
    expect(getByRole("list").children.length).toBe(tagFeatures.length);
  });

  it("should NOT render component with tag features", () => {
    getRenderer({ item: DEFAULT_ITEM });
    expect(queryByRole("list")).not.toBeInTheDocument();
  });

  it(`should render component with ${YEAR_LABEL} when isAnnual is true`, () => {
    getRenderer({ item: { ...DEFAULT_ITEM, isAnnual: true } });
    expect(getByText(YEAR_LABEL)).toBeInTheDocument();
  });

  it(`should NOT render component with ${YEAR_LABEL} when isAnnual is false`, () => {
    getRenderer({ item: { ...DEFAULT_ITEM, isAnnual: false } });
    expect(queryByText(YEAR_LABEL)).not.toBeInTheDocument();
  });

  it(`should render the button ${ADD_TO_CART_BUTTON_LABEL}`, () => {
    getRenderer();
    expect(
      getByRole("button", { name: ADD_TO_CART_BUTTON_LABEL })
    ).toBeInTheDocument();
  });

  it("should call onAddToCart callback when user clicks on it", async () => {
    const onAddToCart = jest.fn();
    getRenderer({ onAddToCart });
    expect(onAddToCart).not.toHaveBeenCalled();
    await userEvent.click(
      getByRole("button", { name: ADD_TO_CART_BUTTON_LABEL })
    );
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });
});

function getRenderer({
  item = DEFAULT_ITEM,
  onAddToCart = jest.fn(),
}: Partial<ComponentProps<typeof CheckoutItemDetailedContent>> = {}) {
  return render(
    <CheckoutItemDetailedContent item={item} onAddToCart={onAddToCart} />
  );
}
