import { Outlet } from "react-router-dom";
import { LayoutBasic } from "~/components/design-system";
import { useAccountIndexViewModel } from "./useAccountIndexViewModel";

export const AccountRoot = () => {
  const viewModel = useAccountIndexViewModel();

  return (
    <LayoutBasic>
      <Outlet context={viewModel} />
    </LayoutBasic>
  );
};
