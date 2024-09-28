import { Card, Title } from "~/components/design-system";

import { AccountNotificationsPreferencesForm } from "./components/AccountNotificationsPreferencesForm";
import { LostAndFoundNotifications } from "./components/LostAndFoundNotifications";

export const AccountNotificationsIndex = () => {
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
    </div>
  );
};
