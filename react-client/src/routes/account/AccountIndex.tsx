import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { MyAccountInfoTabs } from "./components/MyAccountInfoTabs";

export const AccountIndex = () => {
  return (
    <Layout>
      <Header pageTitle="My Account" />
      <MyAccountInfoTabs />
    </Layout>
  );
};