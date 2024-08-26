import { Text } from "~/components/design-system";
import { CheckoutProduct, Colors, Sizes } from "~/mocks/MockRestApiServer";
import { classNames } from "~/util/styleUtil";
import { CartItemImages } from "../CartItemImages";
import { CheckoutProductCard } from "../CheckoutProductCard";
import { CheckoutProductColorSize } from "../CheckoutProductColorSize";
import { CheckoutItemDetailsDrawer } from "../CheckoutItemDetailsDrawer";
import { useCartItemsDetails } from "../hooks/useCartItemDetails";

type CheckoutProductsSectionProps = {
  products: CheckoutProduct[];
};

export const CheckoutProductsSection = ({
  products,
}: CheckoutProductsSectionProps) => {
  const productsLength = products.length;
  const { item, openItemDetails, goBack } = useCartItemsDetails();

  return (
    <>
      <div
        className={classNames("grid grid-cols-1 gap-large", {
          "lg:grid-cols-3": productsLength > 2,
          "lg:grid-cols-2": productsLength >= 1 && productsLength <= 2,
        })}
      >
        {products.map(
          ({
            availableColors,
            availableSizes,
            description,
            id,
            images,
            title,
            ...rest
          }) => (
            <CheckoutProductCard
              {...rest}
              product={<CartItemImages images={images} name={title} />}
              productSpecifications={renderProductSpecifications(
                description,
                availableColors,
                availableSizes
              )}
              title={title}
              onClick={() => openItemDetails(id)}
            />
          )
        )}
      </div>
      {item && <CheckoutItemDetailsDrawer item={item} onClose={goBack} />}
    </>
  );
};

function renderProductSpecifications(
  description?: string,
  availableColors?: Colors[],
  availableSizes?: Sizes[]
) {
  return description ? (
    <Text>{description}</Text>
  ) : (
    availableColors && availableSizes && (
      <CheckoutProductColorSize
        productColors={availableColors}
        productSizes={availableSizes}
      />
    )
  );
}
