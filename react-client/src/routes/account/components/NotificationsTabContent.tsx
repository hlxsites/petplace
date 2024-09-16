import {
  Card,
  DisplayUncontrolledForm,
  Title,
} from "~/components/design-system";
import { notificationsFormSchema } from "../form/notificationForm";
import {
  LostAndFoundNotifications,
  LostNotification,
} from "./LostAndFoundNotifications";

type NotificationsTabProps = {
  isExternalLogin?: boolean;
  lostPetsHistory?: LostNotification[];
};

export const NotificationsTabContent = ({
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
          <DisplayUncontrolledForm
            onSubmit={({ values }) => {
              console.log("onSubmit values", values);
            }}
            schema={notificationsFormSchema}
          />
        </div>
      </Card>
      {isExternalLogin && (
        <LostAndFoundNotifications notifications={lostPetsHistory} />
      )}
    </div>
  );
};
