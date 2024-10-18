import { Card, Title } from "~/components/design-system";
import { ViewNotifications } from "../../components/ViewNotifications";

import { Fragment } from "react";
import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { LostPetUpdateModel } from "~/domain/models/pet/PetModel";
import { useAccountNotificationsIndexViewModel } from "../useAccountNotificationsIndexViewModel";

export const LostAndFoundNotifications = () => {
  const { isSsoEnabledLogin, lostPetsHistory } =
    useAccountNotificationsIndexViewModel();

  if (!isSsoEnabledLogin) return null;

  return (
    <SuspenseAwait resolve={lostPetsHistory}>
      {renderLostPetUpdateModel}
    </SuspenseAwait>
  );

  function renderLostPetUpdateModel(notifications: LostPetUpdateModel[]) {
    return (
      <Card>
        <div className="p-xxlarge">
          <div className="flex items-center justify-between pb-large">
            <Title level="h3">Lost & Found notifications</Title>
          </div>

          {!!notifications.length && (
            <Card>
              <div className="p-large">
                {notifications.map(renderNotification)}
              </div>
            </Card>
          )}
        </div>
      </Card>
    );

    function renderNotification(
      notification: LostPetUpdateModel,
      index: number
    ) {
      const { communicationId, date, foundedBy, petName } = notification;
      const isLast = notifications.length === index + 1;

      const dividerElement = (() => {
        if (isLast) return null;
        return <hr className="-mx-[10%] border-neutral-300" />;
      })();

      return (
        <Fragment key={communicationId}>
          <ViewNotifications
            dateFoundOrLost={date}
            foundedBy={foundedBy?.finderName}
            notificationId={notification.communicationId}
            petName={petName}
          />
          {dividerElement}
        </Fragment>
      );
    }
  }
};
