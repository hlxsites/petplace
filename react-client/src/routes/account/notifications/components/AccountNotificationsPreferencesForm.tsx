import { DisplayForm } from "~/components/design-system";

import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";
import { notificationsFormSchema } from "../../form/notificationForm";
import { useAccountNotificationsIndexViewModel } from "../useAccountNotificationsIndexViewModel";

export const AccountNotificationsPreferencesForm = () => {
  const { isDirty, formValues, isLoading, onChangeForm, onSubmit } =
    useAccountNotificationsIndexViewModel();

  if (isLoading) return <DefaultLoading minHeight={460} />;

  console.log("isDirty", isDirty);

  return (
    <DisplayForm
      isDirty={isDirty}
      onChange={onChangeForm}
      onSubmit={onSubmit}
      schema={notificationsFormSchema}
      values={formValues}
    />
  );
};
