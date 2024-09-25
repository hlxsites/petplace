import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  Title,
} from "~/components/design-system";
import { AccountNotificationModel } from "~/domain/models/user/UserModels";
import { getAccountNotificationsData } from "../form/formDataUtil";
import { notificationsFormSchema } from "../form/notificationForm";
import {
  LostAndFoundNotifications,
  LostNotification,
} from "./LostAndFoundNotifications";

type NotificationsTabProps = {
  accountNotifications?: Promise<AccountNotificationModel | null>;
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
              <DisplayUncontrolledForm
                onSubmit={({ values }) => {
                  console.log("onSubmit values", values);
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
        <LostAndFoundNotifications notifications={lostPetsHistory} />
      )}
    </div>
  );
};
