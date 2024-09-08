import { Button, Text } from "~/components/design-system";

export type ViewNotificationsProps = {
  dateFoundOrLost: number;
  foundedBy?: string;
  onClick?: () => void;
  petName: string;
};

export const ViewNotifications = ({
  dateFoundOrLost,
  foundedBy,
  onClick,
  petName,
}: ViewNotificationsProps) => {
  const date = new Date(dateFoundOrLost).toISOString().split("T")[0];

  return (
    <div className="grid lg:flex lg:justify-between">
      <div className="grid gap-xsmall">
        <Text fontFamily="raleway" fontWeight="bold" size="18" isResponsive>
          Pet {petName} is found by {foundedBy}
        </Text>
        <Text size="14">{date}</Text>
      </div>

      <div className="flex justify-end pt-medium lg:pt-0">
        <Button
          className="text-orange-300-contrast"
          iconLeft="eye"
          onClick={onClick}
          variant="link"
        >
          View
        </Button>
      </div>
    </div>
  );
};
