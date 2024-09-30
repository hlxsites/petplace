import { ACCOUNT_FULL_ROUTE, AppRoutePaths } from "~/routes/AppRoutePaths";
import { getRouteFor } from "~/routes/util/getRouteFor";
import { checkIsExternalLogin } from "~/util/authUtil";
import { RouteBasedTabs, RouteTab } from "../../../components/design-system";
import { useAccountContext } from "../useAccountIndexViewModel";
import { AccountDetailsTabContent } from "./AccountDetailsTabContent";
import { NotificationsTabContent } from "./NotificationsTabContent";
import { PaymentInformationTabContent } from "./PaymentInformationTabContent";

export const MyAccountInfoTabs = () => {
  const viewModel = useAccountContext();
  const {
    accountDetails,
    accountNotifications,
    emergencyContacts,
    lostPetsHistory,
    onDeleteEmergencyContact,
    onSubmitAccountDetails,
    onSubmitAccountNotifications,
    onSubmitEmergencyContacts,
    getLostPetNotification,
  } = viewModel;
  const isExternalLogin = checkIsExternalLogin();

  const myAccountTabOptions: RouteTab[] = [
    {
      content: () => (
        <AccountDetailsTabContent
          isExternalLogin={isExternalLogin}
          accountDetails={accountDetails}
          emergencyContacts={emergencyContacts}
          onDeleteEmergencyContact={onDeleteEmergencyContact}
          onSubmitAccountDetails={onSubmitAccountDetails}
          onSubmitEmergencyContacts={onSubmitEmergencyContacts}
        />
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
          accountNotifications={accountNotifications}
          getLostPetNotificationDetails={getLostPetNotification}
          onSubmitAccountNotifications={onSubmitAccountNotifications}
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
