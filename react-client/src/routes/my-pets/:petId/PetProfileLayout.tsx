import { Outlet, useOutletContext } from "react-router-dom";
import { usePetProfileLayoutViewModel } from "./usePetProfileLayoutViewModel";

type ContextType = ReturnType<typeof usePetProfileLayoutViewModel>;

export const PetProfileLayout = () => {
  const viewModel = usePetProfileLayoutViewModel();

    return <Outlet context={viewModel satisfies ContextType} />;
}

export function usePetProfileContext() {
    return useOutletContext<ContextType>();
  }