import { LinkButton, Text } from "~/components/design-system";
import { parseDate } from "~/util/dateUtils";

export type ViewNotificationsProps = {
  dateFoundOrLost: string;
  foundedBy?: string;
  notificationId: string;
  petName: string;
};

export const ViewNotifications = ({
  dateFoundOrLost,
  foundedBy,
  notificationId,
  petName,
}: ViewNotificationsProps) => {
  return (
    <div className="grid lg:flex lg:justify-between">
      <div className="grid gap-xsmall">
        <Text fontFamily="raleway" fontWeight="bold" size="18" isResponsive>
          Pet {petName} is found by {foundedBy}
        </Text>
        <Text size="14">{parseDate(dateFoundOrLost)}</Text>
      </div>

      <div className="flex justify-end pt-medium lg:pt-0">
        <LinkButton
          className="text-orange-300-contrast"
          iconLeft="eye"
          variant="link"
          to={notificationId}
        >
          View
        </LinkButton>
      </div>
    </div>
  );
};
