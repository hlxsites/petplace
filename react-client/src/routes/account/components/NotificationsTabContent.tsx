import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  Title,
} from "~/components/design-system";
import {
  AccountNotificationModel,
  LostPetUpdateModel,
} from "~/domain/models/user/UserModels";
import { getAccountNotificationsData } from "../form/formDataUtil";
import { notificationsFormSchema } from "../form/notificationForm";
import { LostAndFoundNotifications } from "./LostAndFoundNotifications";

type NotificationsTabProps = {
  accountNotifications?: Promise<AccountNotificationModel | null>;
  isExternalLogin?: boolean;
  lostPetsHistory?: Promise<LostPetUpdateModel[] | null>;
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
        <SuspenseAwait resolve={lostPetsHistory}>
          {(lostPetsHistory) => (
            <LostAndFoundNotifications notifications={lostPetsHistory} />
          )}
        </SuspenseAwait>
      )}
    </div>
  );
};
