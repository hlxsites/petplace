import { Text } from "~/components/design-system";
import {
  CheckoutProduct,
  Colors,
  Image,
  Sizes,
} from "~/mocks/MockRestApiServer";
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
  const { item, openItemDetails, goBack } = useCartItemsDetails();
  const gridColumns = getGridColumns(products.length);

  return (
    <>
      <div className={classNames("grid gap-large", gridColumns)}>
        {products.map((product) => (
          <CheckoutProductCard
            {...product}
            key={product.id}
            onClick={() => openItemDetails(product.id)}
            product={renderProductImage(product.title, product.images)}
            productSpecifications={renderProductSpecifications(
              product.description,
              product.availableColors,
              product.availableSizes
            )}
          />
        ))}
      </div>
      {item && <CheckoutItemDetailsDrawer item={item} onClose={goBack} />}
    </>
  );
};

function getGridColumns(productsLength: number) {
  if (productsLength > 2) return "lg:grid-cols-3";
  if (productsLength >= 1) return "lg:grid-cols-2";
  return "grid-cols-1";
}

function renderProductImage(title: string, images?: Image[] | null) {
  return images && images.length ? (
    <CartItemImages images={images} name={title} />
  ) : null;
}

function renderProductSpecifications(
  description?: string,
  availableColors?: Colors[],
  availableSizes?: Sizes[]
) {
  if (description) return <Text>{description}</Text>;
  if (availableColors && availableSizes) {
    return (
      <CheckoutProductColorSize
        productColors={availableColors}
        productSizes={availableSizes}
      />
    );
  }
  return null;
}
