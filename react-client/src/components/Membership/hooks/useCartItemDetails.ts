import { useSearchParams } from "react-router-dom";
import { getProductById } from "~/mocks/MockRestApiServer";

const CART_ITEM_PARAM = "item";

export function useCartItemsDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemId = searchParams.get(CART_ITEM_PARAM);

  const item = getProductById(itemId);

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
