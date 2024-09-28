import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  Title,
} from "~/components/design-system";
import {
  AccountNotificationsModel,
  LostPetUpdateModel,
} from "~/domain/models/user/UserModels";
import {
  buildAccountNotifications,
  getAccountNotificationsData,
} from "../form/formDataUtil";
import { notificationsFormSchema } from "../form/notificationForm";
import { LostAndFoundNotifications } from "./LostAndFoundNotifications";

type NotificationsTabProps = {
  accountNotifications?: Promise<AccountNotificationsModel | null>;
  isExternalLogin?: boolean;
  lostPetsHistory?: Promise<LostPetUpdateModel[] | null>;
  getLostPetNotificationDetails?: (
    notification: LostPetUpdateModel
  ) => Promise<LostPetUpdateModel | null>;
  onSubmitAccountNotifications?: (values: AccountNotificationsModel) => void;
};

export const NotificationsTabContent = ({
  accountNotifications,
  isExternalLogin,
  lostPetsHistory,
  getLostPetNotificationDetails,
  onSubmitAccountNotifications,
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
              getLostPetNotificationDetails={getLostPetNotificationDetails}
            />
          )}
        </SuspenseAwait>
      )}
    </div>
  );
};
