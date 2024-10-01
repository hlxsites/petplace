import { DisplayForm } from "~/components/design-system";

import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";
import { notificationsFormSchema } from "../../form/notificationForm";
import { useAccountNotificationsIndexViewModel } from "../useAccountNotificationsIndexViewModel";

export const AccountNotificationsPreferencesForm = () => {
  const {
    isDirty,
    formValues,
    isLoading,
    isSubmitting,
    onChangeForm,
    onSubmit,
  } = useAccountNotificationsIndexViewModel();

  if (isLoading) return <DefaultLoading minHeight={460} />;

  return (
    <DisplayForm
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      onChange={onChangeForm}
      onSubmit={onSubmit}
      schema={notificationsFormSchema}
      values={formValues}
    />
  );
};
