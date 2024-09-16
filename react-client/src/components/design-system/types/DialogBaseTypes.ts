import { ComponentProps, CSSProperties, ReactElement, ReactNode } from "react";
import { IconProps } from "../icon/Icon";
import { Title } from "../text/Title";

export type DialogIconProps = {
  icon?: IconProps["display"];
  iconProps?: {
    className?: IconProps["className"];
    size?: IconProps["size"];
  };
};

export type DialogTitleProps = {
  isTitleResponsive?: ComponentProps<typeof Title>["isResponsive"];
  titleSize?: ComponentProps<typeof Title>["size"];
} & (
  | {
      ariaLabel?: string;
      title: string;
    }
  | {
      ariaLabel: string;
      title?: undefined;
    }
);

export type DialogTrigger = ReactElement | undefined;

export type DialogBaseProps = DialogIconProps &
  DialogTitleProps & {
    align?: "center" | "right";
    children:
      | ReactNode
      | ((props: { onCloseWithAnimation?: () => void }) => ReactNode);
    className?: {
      modal: string;
      closeButton: string;
    };
    element: "dialog" | "drawer";
    id: string;
    isOpen: boolean;
    onClose?: () => void;
    padding?: "p-0" | "p-large" | "p-xlarge";
    trigger: DialogTrigger;
    width?: CSSProperties["width"];
  };

export type DialogCommonProps = Omit<
  DialogBaseProps,
  "className" | "element" | "ariaLabel" | "title"
> &
  DialogIconProps &
  DialogTitleProps;
