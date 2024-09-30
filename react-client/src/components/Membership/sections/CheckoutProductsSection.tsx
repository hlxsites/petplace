import { useState } from "react";
import { ProductDescription } from "~/domain/models/products/ProductModel";
import { useCheckoutProductsViewModelContext } from "~/routes/checkout/products/useCheckoutProductsViewModel";

import {
  getInitialProductColorSize,
  getProductPrice,
} from "~/domain/util/checkoutProductUtil";
import { classNames } from "~/util/styleUtil";
import { CheckoutItemDetailsDrawer } from "../CheckoutItemDetailsDrawer";
import { CheckoutProductCard } from "../CheckoutProductCard";
import { useCartItemsDetails } from "../hooks/useCartItemDetails";

export const CheckoutProductsSection = () => {
  const { products, onUpdateCartProduct } =
    useCheckoutProductsViewModelContext();
  const { item, goBack } = useCartItemsDetails();

  const initialProductOptions = (products || []).reduce(
    (acc, product) => {
      const initialColorSizeState = getInitialProductColorSize(product);
      acc[product.id] = initialColorSizeState;
      return acc;
    },
    {} as Record<string, string>
  );

  const [productOptions, setProductOptions] = useState<Record<string, string>>(
    initialProductOptions
  );

  const gridColumns = getGridColumns(products.length);

  const handleAddToCart = (product: ProductDescription) => () => {
    const selectedColorSize = productOptions[product.id];

    // This is a fragile hacky way to get the product id and price
    const id = product.availableOptions[productOptions[product.id]]?.id;
    const price = getProductPrice(product, selectedColorSize);
    if (!id || !price) {
      console.error(
        "Failed to load the product price to insert into the cart",
        { id, price }
      );
      return;
    }

    const [color, size] = selectedColorSize.split("|");
    const description = (() => {
      if (color && size) return `${color} - ${size}`;
      return "";
    })();

    onUpdateCartProduct({
      description,
      id,
      quantity: 1,
      type: product.type,
      title: product.title,
      price,
    });
  };

  const handleMoreInfo = (product: ProductDescription) => () => {
    console.log("product", product);
  };

  const handleOnChangeProductOptions = (productId: string) => {
    return ({ color, size }: { color: string; size: string }) => {
      setProductOptions((prev) => ({
        ...prev,
        [productId]: `${color}|${size}`,
      }));
    };
  };

  return (
    <>
      <div className={classNames("grid gap-large", gridColumns)}>
        {products?.map((product, index) => {
          return (
            <CheckoutProductCard
              key={`${product.id}-${index}` || `product-${index}`}
              onChange={handleOnChangeProductOptions(product.id)}
              onClickAddToCart={handleAddToCart(product)}
              onClickMoreInfo={handleMoreInfo(product)}
              product={product}
              selectedColorSize={productOptions[product.id]}
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
