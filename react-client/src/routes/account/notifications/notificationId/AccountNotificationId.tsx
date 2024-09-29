import { Dialog } from "~/components/design-system";
import { DefaultLoading } from "~/components/design-system/loading/DefaultLoading";
import { NotificationsDialogContent } from "../../components/NotificationsDialogContent";
import { useNotificationsIdViewModel } from "./useNotificationsIdViewModel";

export const AccountNotificationId = () => {
  const { baseNotification, isLoading, notification, onClose } =
    useNotificationsIdViewModel();

  if (!baseNotification) return null;

  const title = (() => {
    const text = `Pet ${baseNotification.petName}`;
    if (baseNotification.foundedBy?.finderName) {
      return `${text} is found by ${baseNotification.foundedBy.finderName}.`;
    }
    return text;
  })();

  const children = (() => {
    if (isLoading) return <DefaultLoading minHeight={374} minWidth={640} />;
    if (!notification) return null;

    return (
      <NotificationsDialogContent onClose={onClose} viewData={notification} />
    );
  })();

  return (
    <Dialog
      ariaLabel="Notifications"
      id="notifications-dialog"
      isOpen
      onClose={onClose}
      title={title}
      titleSize="32"
      trigger={undefined}
      isTitleResponsive
    >
      {children}
    </Dialog>
  );
};
