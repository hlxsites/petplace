import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { DisplayUncontrolledForm } from "~/components/design-system";

import { notificationsFormSchema } from "../../form/notificationForm";
import {
  buildAccountNotifications,
  getAccountNotificationsData,
} from "../../util/formDataUtil";
import { useAccountNotificationsIndexViewModel } from "../useAccountNotificationsIndexViewModel";

export const AccountNotificationsPreferencesForm = () => {
  const { accountNotifications, onSubmitAccountNotifications } =
    useAccountNotificationsIndexViewModel();

  return (
    <SuspenseAwait resolve={accountNotifications}>
      {(accountNotifications) => (
        <DisplayUncontrolledForm
          onSubmit={({ values }) => {
            onSubmitAccountNotifications?.(buildAccountNotifications(values));
          }}
          schema={notificationsFormSchema}
          initialValues={getAccountNotificationsData(accountNotifications)}
        />
      )}
    </SuspenseAwait>
  );
};
