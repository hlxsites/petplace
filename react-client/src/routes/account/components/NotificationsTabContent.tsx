import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Card, DisplayForm, Title } from "~/components/design-system";
import { AccountNotificationModel } from "~/domain/models/user/UserModels";
import { notificationsFormSchema } from "../form/notificationForm";
import {
  LostAndFoundNotifications,
  LostNotification,
} from "./LostAndFoundNotifications";
import { getAccountNotificationsData } from "./util/formDataUtil";

type NotificationsTabProps = {
  accountNotifications: Promise<AccountNotificationModel | null>;
  isExternalLogin?: boolean;
  lostPetsHistory?: LostNotification[];
};

export const NotificationsTabContent = ({
  accountNotifications,
  isExternalLogin,
  lostPetsHistory,
}: NotificationsTabProps) => {
  return (
    <div className="mt-xxxlarge grid gap-large">
      <Title level="h2" size="24">
        Communication Preferences
      </Title>
      <Card role="region">
        <div className="p-xxlarge">
          <SuspenseAwait resolve={accountNotifications}>
            {(accountNotifications) => (
              <DisplayForm
                onChange={(props) => {
                  console.log("onChange values", props);
                }}
                onSubmit={({ event, values }) => {
                  event.preventDefault();

                  console.log("onSubmit values", values);
                }}
                schema={notificationsFormSchema}
                values={getAccountNotificationsData(accountNotifications)}
              />
            )}
          </SuspenseAwait>
        </div>
      </Card>
      {isExternalLogin && (
        <LostAndFoundNotifications notifications={lostPetsHistory} />
      )}
    </div>
  );
};
