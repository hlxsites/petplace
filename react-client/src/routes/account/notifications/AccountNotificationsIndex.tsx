import { Card, Title } from "~/components/design-system";

import { Outlet } from "react-router-dom";
import { AccountNotificationsPreferencesForm } from "./components/AccountNotificationsPreferencesForm";
import { LostAndFoundNotifications } from "./components/LostAndFoundNotifications";
import { useAccountNotificationsIndexViewModel } from "./useAccountNotificationsIndexViewModel";

export const AccountNotificationsIndex = () => {
  const viewModel = useAccountNotificationsIndexViewModel();
  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h2" size="24">
        Communication Preferences
      </Title>
      <Card role="region">
        <div className="p-xxlarge">
          <AccountNotificationsPreferencesForm />
        </div>
      </Card>
      <LostAndFoundNotifications />
      <Outlet context={viewModel} />
    </div>
  );
};
