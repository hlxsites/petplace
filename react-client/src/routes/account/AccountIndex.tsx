import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { useAccountIndexViewModel } from "./useAccountIndexViewModel";

export const AccountIndex = () => {
  const { accountInfo } = useAccountIndexViewModel();

  return (
    <Layout>
      <Header pageTitle="My Account" />
      {accountInfo}
    </Layout>
  );
};
