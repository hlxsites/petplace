import { Outlet } from "react-router-dom";
import { usePetProfileLayoutViewModel } from "./usePetProfileLayoutViewModel";

export const PetProfileLayout = () => {
  const viewModel = usePetProfileLayoutViewModel();

  return <Outlet context={viewModel} />;
};
