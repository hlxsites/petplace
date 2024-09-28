import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  Title,
} from "~/components/design-system";

import { LostAndFoundNotifications } from "../components/LostAndFoundNotifications";
import { notificationsFormSchema } from "../form/notificationForm";
import { useAccountContext } from "../useAccountIndexViewModel";
import {
  buildAccountNotifications,
  getAccountNotificationsData,
} from "../util/formDataUtil";

export const AccountNotificationsIndex = () => {
  const {
    accountNotifications,
    isExternalLogin,
    lostPetsHistory,
    getLostPetNotification,
    onSubmitAccountNotifications,
  } = useAccountContext();

  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h2" size="24">
        Communication Preferences
      </Title>
      <Card role="region">
        <div className="p-xxlarge">
          <SuspenseAwait resolve={accountNotifications}>
            {(accountNotifications) => (
              <DisplayUncontrolledForm
                onSubmit={({ values }) => {
                  onSubmitAccountNotifications?.(
                    buildAccountNotifications(values)
                  );
                }}
                schema={notificationsFormSchema}
                initialValues={getAccountNotificationsData(
                  accountNotifications
                )}
              />
            )}
          </SuspenseAwait>
        </div>
      </Card>
      {isExternalLogin && (
        <SuspenseAwait resolve={lostPetsHistory}>
          {(lostPetsHistory) => (
            <LostAndFoundNotifications
              notifications={lostPetsHistory || []}
              getLostPetNotificationDetails={getLostPetNotification}
            />
          )}
        </SuspenseAwait>
      )}
    </div>
  );
};
