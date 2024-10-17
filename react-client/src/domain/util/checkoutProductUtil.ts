import { logError } from "~/infrastructure/telemetry/logUtils";
import { CartItem } from "../models/cart/CartModel";
import { ProductDescription } from "../models/products/ProductModel";

export const getInitialProductColorSize = (
  product: ProductDescription
): string => {
  const availableColors = product.availableColors ?? [];
  const availableSizes = product.availableSizes ?? [];

  const initialColor = availableColors[0];
  const initialSize = availableSizes[0];

  if (
    (typeof initialColor === "string" && !!initialColor) ||
    (typeof initialSize === "string" && !!initialSize)
  ) {
    return `${initialColor}|${initialSize}`;
  }

  return "default";
};

export const findProductBasedOnOptionId = (
  optionId: string,
  products: ProductDescription[]
): ProductDescription => {
  return products.find((product) => {
    return Object.keys(product.availableOptions).some((key) => {
      return product.availableOptions[key].id === optionId;
    });
  }) as ProductDescription;
};

export const getProductColorSizeBasedOnCartId = (
  cartId: string,
  product: ProductDescription
): string | undefined => {
  return Object.keys(product.availableOptions).find((key) => {
    if (product.availableOptions[key].id === cartId) {
      return key;
    }
  });
};

export const getProductPrice = (
  product: ProductDescription,
  selectedColorSize: string
): string | null => {
  const productOption = product.availableOptions[selectedColorSize];
  if (productOption) return productOption.price;

  // try the default option
  return product.availableOptions?.["default"]?.price || null;
};

export const convertProductToCartItem = (
  product: ProductDescription,
  selectedColorSize: string
): CartItem | null => {
  // This is a fragile hacky way to get the product id and price
  const id = product.availableOptions[selectedColorSize]?.id;
  const price = getProductPrice(product, selectedColorSize);
  if (!id || !price) {
    logError("Failed to load the product price to insert into the cart", {
      id,
      price,
    });
    return null;
  }

  const [color, size] = selectedColorSize.split("|");
  const description = (() => {
    if (color && size) return `${color} - ${size}`;
    return "";
  })();

  return {
    description,
    id,
    quantity: 1,
    type: product.type,
    title: product.title,
    price,
  };
};
