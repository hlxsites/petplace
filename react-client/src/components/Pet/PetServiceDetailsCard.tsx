import { ReactNode } from "react";
import { Button, Card, Icon, IconKeys, Text, Title } from "../design-system";
import { ConfirmDialog } from "../design-system/dialog/ConfirmDialog";

export type PetServiceDetailsCardProps = {
  additionalInfo?: ReactNode;
  contact?: string;
  description: ReactNode;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onConfirmModal: () => void;
  primaryAction?: ServiceAction;
  secondaryActions?: (ServiceAction & { icon: IconKeys })[];
};

type ServiceAction = {
  buttonLabel: string;
  confirmButtonLabel?: string;
  message?: string;
  title?: string;
  onClick?: () => void;
};

export const PetServiceDetailsCard = ({
  additionalInfo,
  contact,
  description,
  isModalOpen,
  onCloseModal,
  onConfirmModal,
  primaryAction,
  secondaryActions,
}: PetServiceDetailsCardProps) => {
  return (
    <div className="flex flex-col gap-large">
      <div className="grid gap-small">
        <Title level="h5">Service Description:</Title>
        <Text size="14">{description}</Text>
      </div>
      {(additionalInfo || contact) && (
        <Card>
          {additionalInfo}
          {contact && (
            <div className="flex w-full justify-center py-xlarge">
              <Text fontWeight="bold" size="18">
                {contact}
              </Text>
            </div>
          )}
        </Card>
      )}
      {secondaryActions && (
        <div className="flex justify-between gap-small">
          {secondaryActions.map(({ icon, buttonLabel: label, onClick }) => (
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
      {primaryAction?.confirmButtonLabel && (
        <ConfirmDialog
          icon="info"
          isOpen={isModalOpen}
          message={primaryAction.message}
          onClose={onCloseModal}
          onClickPrimaryButton={onConfirmModal}
          confirmButtonLabel={primaryAction.confirmButtonLabel}
          title={primaryAction.title ?? ""}
          type="confirm"
          trigger={
            <Button onClick={primaryAction.onClick} fullWidth>
              {primaryAction.buttonLabel}
            </Button>
          }
        />
      )}
    </div>
  );
};
