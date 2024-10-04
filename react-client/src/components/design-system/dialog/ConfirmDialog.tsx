import { ReactNode } from "react";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
import { DialogTrigger } from "../types/DialogBaseTypes";
import { Dialog } from "./Dialog";
import { Title } from "../text/Title";
import { Icon, IconKeys } from "../icon/Icon";
import { classNames } from "~/util/styleUtil";

export type ConfirmDialogType = "error" | "info" | "success";

export type ConfirmDialogDetails = {
  confirmButtonLabel?: string;
  icon?: IconKeys;
  message?: ReactNode | string;
  title: string;
  type: ConfirmDialogType;
};

type ConfirmDialogProps = ConfirmDialogDetails & {
  isOpen: boolean;
  onClickPrimaryButton?: () => void;
  onClose: () => void;
  trigger?: DialogTrigger;
};

export const ConfirmDialog = ({
  icon,
  isOpen,
  message,
  onClickPrimaryButton,
  onClose,
  confirmButtonLabel,
  title,
  type,
  trigger,
}: ConfirmDialogProps) => {
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
      ariaLabel={`${type}-dialog`}
      id={`${type}-dialog`}
      isOpen={isOpen}
      isTitleResponsive
      onClose={onClose}
      titleSize="32"
      trigger={trigger}
    >
      {({ onCloseWithAnimation }) => (
        <div className="flex flex-col items-center justify-center gap-xlarge p-base md:items-start">
          <div
            className={classNames(
              "flex h-16 w-16 items-center justify-center rounded-full bg-red-300",
              {
                "bg-green-300": type === "success",
                "bg-red-300": type === "error",
                "bg-blue-300": type === "info",
              }
            )}
          >
            <Icon
              className="text-neutral-white"
              display={icon ?? "clearCircle"}
              size={26}
            />
          </div>

          <Title level="h2" size="32" isResponsive>
            {title}
          </Title>
          {messageElement}

          <div className="flex w-full gap-base">
            <Button
              fullWidth
              onClick={onCloseWithAnimation}
              variant="secondary"
            >
              Dismiss
            </Button>
            {confirmButtonLabel && primaryActionButton()}
          </div>
        </div>
      )}
    </Dialog>
  );

  function primaryActionButton() {
    return (
      <Button fullWidth onClick={onClickPrimaryButton}>
        {confirmButtonLabel}
      </Button>
    );
  }
};
