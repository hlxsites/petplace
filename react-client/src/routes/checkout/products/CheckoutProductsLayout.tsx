import { Outlet } from "react-router-dom";
import { useCheckoutProductsViewModel } from "./useCheckoutProductsViewModel";

export const CheckoutProductsLayout = () => {
  const viewModel = useCheckoutProductsViewModel();

  return <Outlet context={viewModel} />;
};
