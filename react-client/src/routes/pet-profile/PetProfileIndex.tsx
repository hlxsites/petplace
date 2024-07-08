import { Layout } from "~/components/design-system/layout/Layout";
import { usePetProfileIndexViewModel } from "./usePetProfileIndexViewModel";
import { Header } from "~/components/design-system/header/Header";

export const PetProfileIndex = () => {
  const { petInfo } = usePetProfileIndexViewModel();

  return (
    <Layout>
      <Header pageTitle="Pet Profile" shouldRenderBackButton />
      <div>{petInfo}</div>
    </Layout>
  );
};
