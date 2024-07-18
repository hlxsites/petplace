import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { useAddNewPetIndexViewModel } from "./useAddNewPetIndexViewModel";
import { Tab } from "~/components/design-system/tab/Tab";

export const AddNewPetIndex = () => {
  const { petRegistration } = useAddNewPetIndexViewModel();

  return (
    <Layout>
      <Header pageTitle="Add new pet" shouldRenderBackButton />
      {petRegistration}
      <Tab
        tabs={[
          {
            icon: "add",
            label: "Tab 1",
            content: "Content of tab 1",
          },
          {
            icon: "shieldOff",
            label: "Tab 2",
            content: "Content of tab 2",
          },
        ]}
      />
    </Layout>
  );
};
