import { ReactNode } from "react";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
import { DialogTrigger } from "../types/DialogBaseTypes";
import { Dialog } from "./Dialog";
import { Title } from "../text/Title";
import { Icon } from "../icon/Icon";

type ConfirmDeletionDialogProps = {
  isOpen: boolean;
  message?: ReactNode | string;
  onClose: () => void;
  title: string;
  trigger?: DialogTrigger;
};

export const ErrorDialog = ({
  isOpen,
  message,
  onClose,
  title,
  trigger,
}: ConfirmDeletionDialogProps) => {
  const messageElement = (() => {
    if (message && typeof message !== "string") return message;

    return (
      <Text color="neutral-700" size="16" isResponsive>
        {message}
      </Text>
    );
  })();

  return (
    <Dialog
      ariaLabel="error dialog"
      id="error-dialog"
      isOpen={isOpen}
      isTitleResponsive
      onClose={onClose}
      titleSize="32"
      trigger={trigger}
    >
      {({ onCloseWithAnimation }) => (
        <div className="flex flex-col items-center justify-center gap-xlarge p-base md:items-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-300">
            <Icon
              className="text-neutral-white"
              display="clearCircle"
              size={26}
            />
          </div>

          <Title level="h2" size="32" isResponsive>
            {title}
          </Title>
          {messageElement}

          <Button fullWidth onClick={onCloseWithAnimation} variant="secondary">
            Dismiss
          </Button>
        </div>
      )}
    </Dialog>
  );
};
