import { useSearchParams } from "react-router-dom";
import { DetailedCartItem } from "~/domain/models/products/ProductModel";

const CART_ITEM_PARAM = "item";

export function useCartItemsDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemId = searchParams.get(CART_ITEM_PARAM);

  // TODO: Implement the logic to get the item details from the server
  console.log("itemId", itemId);

  const item: DetailedCartItem | null = null;

  function goBack() {
    searchParams.delete(CART_ITEM_PARAM);
    setSearchParams(searchParams);
  }

  function openItemDetails(id: string) {
    searchParams.set(CART_ITEM_PARAM, id);
    setSearchParams(searchParams);
  }

  return {
    item,
    goBack,
    openItemDetails,
  };
}
