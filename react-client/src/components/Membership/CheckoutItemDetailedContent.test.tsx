import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { DetailedCartItem } from "~/domain/models/products/ProductModel";
import { CheckoutItemDetailedContent } from "./CheckoutItemDetailedContent";

const ADD_TO_CART_BUTTON_LABEL = "Add to cart";
const YEAR_LABEL = "/year";
const DEFAULT_ITEM: DetailedCartItem = {
  availableColors: [],
  availableSizes: [],
  availableOptions: {},
  id: "item-id",
  title: "Item title",
  detailedDescription: "Item description",
  images: [],
  type: "item-type",
};

const { getByRole, getByText, queryByText, queryByRole } = screen;

describe("CheckoutItemDetailedContent", () => {
  // TODO: Re-enable this test once the component is fixed
  it.skip.each(["19.95", "100.00"])(
    "should render component with given price",
    (price) => {
      getRenderer({
        product: {
          ...DEFAULT_ITEM,
          availableOptions: {
            default: {
              id: "ByteTag-Black R Cat",
              price,
            },
          },
        },
      });
      expect(getByText(`$${price}`)).toBeInTheDocument();
    }
  );

  it.each(["A description", "Another description"])(
    "should render component with given description",
    (detailedDescription) => {
      getRenderer({ product: { ...DEFAULT_ITEM, detailedDescription } });
      expect(getByText(detailedDescription)).toBeInTheDocument();
    }
  );

  it.each(["An additional info", "Another additional info"])(
    "should render component with given info",
    (additionalInfo) => {
      getRenderer({ product: { ...DEFAULT_ITEM, additionalInfo } });
      expect(getByText(additionalInfo)).toBeInTheDocument();
    }
  );

  it.each(["A feature", "Another feature"])(
    "should render component with given privacy features",
    (privacyFeatures) => {
      getRenderer({ product: { ...DEFAULT_ITEM, privacyFeatures } });
      expect(getByText(privacyFeatures)).toBeInTheDocument();
    }
  );

  it.each(["A size", "Another size"])(
    "should render component with given sizing",
    (sizing) => {
      getRenderer({ product: { ...DEFAULT_ITEM, sizing } });
      expect(getByText(sizing)).toBeInTheDocument();
    }
  );

  it.each([
    ["An unique tag feature"],
    ["A tag feature", "Another tag feature"],
  ])("should render component with given tag features", (...tagFeatures) => {
    getRenderer({ product: { ...DEFAULT_ITEM, tagFeatures } });
    expect(getByRole("list")).toBeInTheDocument();
    expect(getByRole("list").children.length).toBe(tagFeatures.length);
  });

  it("should NOT render component with tag features", () => {
    getRenderer({ product: DEFAULT_ITEM });
    expect(queryByRole("list")).not.toBeInTheDocument();
  });

  it(`should render component with ${YEAR_LABEL} when isAnnual is true`, () => {
    getRenderer({ product: { ...DEFAULT_ITEM, isAnnual: true } });
    expect(getByText(YEAR_LABEL)).toBeInTheDocument();
  });

  it(`should NOT render component with ${YEAR_LABEL} when isAnnual is false`, () => {
    getRenderer({ product: { ...DEFAULT_ITEM, isAnnual: false } });
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
  product = DEFAULT_ITEM,
  onAddToCart = jest.fn(),
  onChange = jest.fn(),
  selectedColorSize = "black | L",
}: Partial<ComponentProps<typeof CheckoutItemDetailedContent>> = {}) {
  return render(
    <CheckoutItemDetailedContent
      product={product}
      onAddToCart={onAddToCart}
      onChange={onChange}
      selectedColorSize={selectedColorSize}
    />
  );
}
