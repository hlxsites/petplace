import { Outlet } from "react-router-dom";
import { LayoutBasic } from "~/components/design-system";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";

export const MyPetsLayout = () => {
  const viewModel = useMyPetsIndexViewModel();

  return (
    <LayoutBasic>
      <Outlet context={viewModel} />
    </LayoutBasic>
  );
};
