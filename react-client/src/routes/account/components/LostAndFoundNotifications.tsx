import { Card, Title } from "~/components/design-system";
import { ViewNotifications } from "./ViewNotifications";

import { Fragment, useState } from "react";
import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { NotificationsDialog } from "./NotificationsDialog";

export type LostAndFoundNotificationsProps = {
  notifications?: LostPetUpdateModel[] | null;
};

export const LostAndFoundNotifications = ({
  notifications = [],
}: LostAndFoundNotificationsProps) => {
  const [selectedNotification, setSelectedNotification] =
    useState<LostPetUpdateModel | null>(null);

  return (
    <>
      <Card>
        <div className="p-xxlarge">
          <div className="flex items-center justify-between pb-large">
            <Title level="h3">Lost & Found notifications</Title>
            <div className="flex gap-large"></div>
          </div>

          {notifications && notifications.length > 0 && (
            <Card>
              <div className="p-large">
                {notifications.map((notification, index) =>
                  renderNotification(notification, index)
                )}
              </div>
            </Card>
          )}
        </div>
      </Card>

      {selectedNotification && (
        <NotificationsDialog
          isOpen={!!selectedNotification}
          onClose={onCloseDialog}
          viewData={selectedNotification}
          petName={selectedNotification.petName}
        />
      )}
    </>
  );

  function renderNotification(notification: LostPetUpdateModel, index: number) {
    const { date, id, foundedBy, petName } = notification;
    return (
      <Fragment key={`notification-${petName}-${index}`}>
        <div key={`${petName}-${id}`}>
          <ViewNotifications
            dateFoundOrLost={date}
            foundedBy={foundedBy?.finderName}
            onClick={() => onOpenDialog(notification)}
            petName={petName}
          />
          {renderHorizontalDivider(index + 1)}
        </div>
      </Fragment>
    );
  }

  function renderHorizontalDivider(index: number) {
    if (notifications && notifications.length === index) return null;
    return <hr className="-mx-[10%] border-neutral-300" />;
  }

  function onOpenDialog(notification: LostPetUpdateModel) {
    setSelectedNotification(notification);
  }

  function onCloseDialog() {
    setSelectedNotification(null);
  }
};
