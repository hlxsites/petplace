import { ProductDescription } from "~/domain/models/products/ProductModel";
import { useCheckoutProductsViewModelContext } from "~/routes/checkout/products/useCheckoutProductsViewModel";
import { classNames } from "~/util/styleUtil";
import { CheckoutItemDetailsDrawer } from "../CheckoutItemDetailsDrawer";
import { CheckoutProductCard } from "../CheckoutProductCard";
import { useCartItemsDetails } from "../hooks/useCartItemDetails";

export const CheckoutProductsSection = () => {
  const { products } = useCheckoutProductsViewModelContext();

  const { item, goBack } = useCartItemsDetails();

  if (!products) return null;

  const gridColumns = getGridColumns(products.length);

  const handleAddToCart = (product: ProductDescription) => () => {
    console.log("product", product);
  };

  const handleMoreInfo = (product: ProductDescription) => () => {
    console.log("product", product);
  };

  return (
    <>
      <div className={classNames("grid gap-large", gridColumns)}>
        {products.map((product, index) => {
          return (
            <CheckoutProductCard
              key={`${product.id}-${index}` || `product-${index}`}
              onClickAddToCart={handleAddToCart(product)}
              onClickMoreInfo={handleMoreInfo(product)}
              product={product}
            />
          );
        })}
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
