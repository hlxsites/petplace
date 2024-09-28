import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  Title,
} from "~/components/design-system";
import { getAccountNotificationsData } from "../util/formDataUtil";
import { notificationsFormSchema } from "../form/notificationForm";
import { LostAndFoundNotifications } from "./LostAndFoundNotifications";
import { useAccountContext } from "../useAccountIndexViewModel";

export const NotificationsTabContent = () => {
  const viewModel = useAccountContext();
  const { accountNotifications, isExternalLogin, lostPetsHistory } = viewModel;

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
