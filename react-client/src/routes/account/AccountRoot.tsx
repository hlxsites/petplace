import { Outlet } from "react-router-dom";
import {
  Layout,
  LayoutBasic,
  RouteBasedTabs,
  RouteTab,
} from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { ACCOUNT_FULL_ROUTE, AppRoutePaths } from "../AppRoutePaths";
import { getRouteFor } from "../util/getRouteFor";
import { useAccountRootViewModel } from "./useAccountRootViewModel";

export const AccountRoot = () => {
  const viewModel = useAccountRootViewModel();

  return (
    <LayoutBasic>
      <Layout>
        <Header
          pageTitle="My Account"
          titleProps={{ level: "h1", size: "32" }}
        />
        <RouteBasedTabs tabs={getRouteTabs()} />
      </Layout>
    </LayoutBasic>
  );

  function getRouteTabs(): RouteTab[] {
    const children = <Outlet />;

    const tabs: RouteTab[] = [
      {
        content: () => children,
        exactRoute: true,
        icon: "user",
        label: "Account details",
        route: getRouteFor(ACCOUNT_FULL_ROUTE, ""),
      },
      {
        content: () => children,
        icon: "bell",
        label: "Notifications",
        route: getRouteFor(
          ACCOUNT_FULL_ROUTE,
          AppRoutePaths.accountNotifications
        ),
      },
    ];

    if (viewModel.isExternalLogin) {
      tabs.push({
        content: () => children,
        icon: "paymentCard",
        label: "Payment information",
        route: getRouteFor(ACCOUNT_FULL_ROUTE, AppRoutePaths.accountPayment),
      });
    }
    return tabs;
  }
};
