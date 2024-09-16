import { ReactNode } from "react";
import { Button, Card, Icon, IconKeys, Text } from "../design-system";

export type PetServiceDetailsCardProps = {
  additionalInfo?: ReactNode;
  contact?: string;
  description: ReactNode;
  primaryAction?: ServiceAction;
  secondaryActions?: (ServiceAction & { icon: IconKeys })[];
};

type ServiceAction = {
  label: string;
  onClick?: () => void;
};

export const PetServiceDetailsCard = ({
  additionalInfo,
  contact,
  description,
  primaryAction,
  secondaryActions,
}: PetServiceDetailsCardProps) => {
  return (
    <div className="flex flex-col gap-large">
      <div>
        <Text fontWeight="bold" size="sm">
          Service Description:
        </Text>
        <Text>{description}</Text>
      </div>
      {(additionalInfo || contact) && (
        <Card>
          {additionalInfo}
          {contact && (
            <div className="flex w-full justify-center py-xlarge">
              <Text fontWeight="bold">{contact}</Text>
            </div>
          )}
        </Card>
      )}
      {secondaryActions && (
        <div className="flex justify-between gap-small">
          {secondaryActions.map(({ icon, label, onClick }) => (
            <Button variant="secondary" key={label} onClick={onClick} fullWidth>
              <Icon
                display={icon}
                className="mr-small text-orange-300-contrast"
              />
              {label}
            </Button>
          ))}
        </div>
      )}
      {primaryAction && (
        <Button onClick={primaryAction.onClick} fullWidth>
          {primaryAction.label}
        </Button>
      )}
    </div>
  );
};
