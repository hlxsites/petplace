import { Text } from "~/components/design-system";
import { ProductDescription } from "~/domain/models/products/ProductModel";
import { classNames } from "~/util/styleUtil";
import { CartItemImages } from "../CartItemImages";
import { CheckoutItemDetailsDrawer } from "../CheckoutItemDetailsDrawer";
import { CheckoutProductCard } from "../CheckoutProductCard";
import { CheckoutProductColorSize } from "../CheckoutProductColorSize";
import { useCartItemsDetails } from "../hooks/useCartItemDetails";

type CheckoutProductsSectionProps = {
  products: ProductDescription[];
};

export const CheckoutProductsSection = ({
  products,
}: CheckoutProductsSectionProps) => {
  const { item, openItemDetails, goBack } = useCartItemsDetails();

  const validProducts = Array.isArray(products)
    ? products.filter(isValidProduct)
    : [];

  const gridColumns = getGridColumns(validProducts.length);

  return (
    <>
      <div className={classNames("grid gap-large", gridColumns)}>
        {validProducts.map((product, index) => (
          <CheckoutProductCard
            {...product}
            key={`${product.id}-${index}` || `product-${index}`}
            onClick={() => openItemDetails(product.id)}
            product={renderProductImage(product.title)}
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

  function isValidProduct(
    product: ProductDescription
  ): product is ProductDescription & {
    id: string;
    title: string;
    price: string;
  } {
    return (
      !!product.id &&
      !!product.title &&
      !!product.price &&
      typeof product.id === "string" &&
      typeof product.title === "string" &&
      typeof product.price === "string"
    );
  }
};

function getGridColumns(productsLength: number) {
  if (productsLength > 2) return "lg:grid-cols-3";
  if (productsLength >= 1) return "lg:grid-cols-2";
  return "grid-cols-1";
}

function renderProductImage(
  title: ProductDescription["title"],
  images?: string[] | null
) {
  return images && images.length ? (
    <CartItemImages images={images} name={title || "image"} />
  ) : null;
}

function renderProductSpecifications(
  description?: ProductDescription["description"],
  availableColors?: ProductDescription["availableColors"],
  availableSizes?: ProductDescription["availableSizes"]
) {
  if (description)
    return (
      <Text color="background-color-tertiary" size="12">
        {description}
      </Text>
    );
  if (availableColors || availableSizes) {
    return (
      <CheckoutProductColorSize
        productColors={availableColors}
        productSizes={availableSizes}
      />
    );
  }
  return null;
}
