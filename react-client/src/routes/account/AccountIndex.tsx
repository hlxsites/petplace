import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { MyAccountInfoSection } from "~/components/MyAccount/section/MyAccountInfoSection";

export const AccountIndex = () => {
  return (
    <Layout>
      <Header pageTitle="My Account" />
      <MyAccountInfoSection />
    </Layout>
  );
};
