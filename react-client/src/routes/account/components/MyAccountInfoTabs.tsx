import { ACCOUNT_FULL_ROUTE, AppRoutePaths } from "~/routes/AppRoutePaths";
import { getRouteFor } from "~/routes/util/getRouteFor";
import { RouteBasedTabs, RouteTab } from "../../../components/design-system";
import { useAccountContext } from "../useAccountIndexViewModel";
import { AccountDetailsTabContent } from "./AccountDetailsTabContent";
import { NotificationsTabContent } from "./NotificationsTabContent";
import { PaymentInformationTabContent } from "./PaymentInformationTabContent";
import { checkIsExternalLogin } from "~/util/authUtil";

export const MyAccountInfoTabs = () => {
  const viewModel = useAccountContext();
  const { accountDetails, lostPetsHistory } = viewModel;
  const isExternalLogin = checkIsExternalLogin()

  const myAccountTabOptions: RouteTab[] = [
    {
      content: () => (
        <AccountDetailsTabContent isExternalLogin={isExternalLogin} accountDetails={accountDetails} />
      ),
      exactRoute: true,
      icon: "user",
      label: "Account details",
      route: getRouteFor(ACCOUNT_FULL_ROUTE, ""),
    },
    {
      content: () => (
        <NotificationsTabContent
          isExternalLogin={isExternalLogin}
          lostPetsHistory={lostPetsHistory}
        />
      ),
      icon: "bell",
      label: "Notifications",
      route: getRouteFor(
        ACCOUNT_FULL_ROUTE,
        AppRoutePaths.accountNotifications
      ),
    },
  ];

  if (isExternalLogin) {
    const paymentInformation: RouteTab = {
      content: () => <PaymentInformationTabContent />,
      icon: "paymentCard",
      label: "Payment information",
      route: getRouteFor(ACCOUNT_FULL_ROUTE, AppRoutePaths.accountPayment),
    };

    myAccountTabOptions.push(paymentInformation);
  }

  return (
    <>
      <RouteBasedTabs tabs={myAccountTabOptions} />
    </>
  );
};
