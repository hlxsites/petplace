import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { useAddNewPetIndexViewModel } from "./useAddNewPetIndexViewModel";

export const AddNewPetIndex = () => {
  const { petRegistration } = useAddNewPetIndexViewModel();

  return (
    <Layout>
      <Header pageTitle="Add new pet" shouldRenderBackButton />
      {petRegistration}
    </Layout>
  );
};
