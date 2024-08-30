import { ButtonProps } from "../button/Button";
import { IconButton } from "../button/IconButton";
import { IconKeys } from "../icon/Icon";

type ImageCarouselButtonProps = {
  type: IconButtonTypes;
  disabled?: boolean;
  onClick: () => void;
};

export type IconButtonTypes = "next" | "previous";

type RenderedIconButton = Record<
  IconButtonTypes,
  {
    icon: IconKeys;
    iconProps: { size: number; className: string };
    label: string;
    variant: ButtonProps["variant"];
    disabled?: boolean;
  }
>;

export const ImageCarouselButton = ({
  disabled,
  onClick,
  type,
}: ImageCarouselButtonProps) => {
  const iconProps = disabled
    ? {
        className:
          "text-neutral-400 p-[4px] rounded-full border-[0.57px] border-text-color-supporting",
        size: 15,
      }
    : {
        className:
          "text-orange-300-contrast p-small bg-white rounded-full border-[0.5px] border-solid border-text-color-supporting -mx-[4px]",
        size: 25,
      };

  const props = (
    {
      previous: {
        icon: "chevronLeft",
        iconProps,
        label: "Previous Slide",
        variant: "link",
        disabled,
      },
      next: {
        icon: "chevronRight",
        iconProps,
        label: "Next Slide",
        variant: "link",
        disabled,
      },
    } satisfies RenderedIconButton
  )[type];

  return <IconButton {...props} onClick={onClick} />;
};
