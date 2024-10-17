import { ReactNode } from "react";
import {
  Button,
  Card,
  Icon,
  IconKeys,
  Text,
  TextSpan,
  Title,
} from "../design-system";
import { ConfirmDialog } from "../design-system/dialog/ConfirmDialog";

export type PetServiceDetailsCardProps = {
  additionalInfo?: ReactNode;
  contact?: string;
  description: ReactNode;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onConfirmModal: () => void;
  primaryAction?: ServiceAction;
  secondaryActions?: ServiceAction[];
};

type ServiceAction = {
  buttonLabel: string;
  confirmButtonLabel?: string;
  message?: string;
  title?: string;
  onClick?: () => void;
  href?: string;
  icon?: IconKeys;
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
        <TextSpan size="14">{description}</TextSpan>
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
          {secondaryActions.map(renderAction)}
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
          type="info"
          trigger={
            <Button onClick={primaryAction.onClick} fullWidth>
              {primaryAction.buttonLabel}
            </Button>
          }
        />
      )}
    </div>
  );

  function renderAction({
    icon,
    buttonLabel: label,
    onClick,
    href,
  }: ServiceAction) {
    const button = (
      <Button variant="secondary" key={label} onClick={onClick} fullWidth>
        {icon && (
          <Icon display={icon} className="mr-small text-orange-300-contrast" />
        )}
        {label}
      </Button>
    );

    if (!href) {
      return button;
    }

    return (
      <a href={href} key={label} style={{ width: "100%" }}>
        {button}
      </a>
    );
  }
};
