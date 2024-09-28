import { useSearchParams } from "react-router-dom";
import { AppRoutePaths } from "~/routes/AppRoutePaths";

export const useMembershipProductsLink = (id: string) => {
  const [searchParams] = useSearchParams();
  const updatedSearchParams = new URLSearchParams(searchParams);
  updatedSearchParams.set("plan", id);

  return `${AppRoutePaths.products}?${updatedSearchParams.toString()}`;
};
