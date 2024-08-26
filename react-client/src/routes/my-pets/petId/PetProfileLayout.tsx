import { Outlet } from "react-router-dom";
import { Layout } from "~/components/design-system/layout/Layout";
import { usePetProfileLayoutViewModel } from "./usePetProfileLayoutViewModel";

export const PetProfileLayout = () => {
  const viewModel = usePetProfileLayoutViewModel();

  return (
    <Layout>
      <Outlet context={viewModel} />
    </Layout>
  );
};
