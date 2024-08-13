import { ComponentProps, ReactNode } from "react";
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
  titleLevel?: ComponentProps<typeof Title>["level"];
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

export type DialogBaseProps = DialogIconProps &
  DialogTitleProps & {
    align?: "center" | "right";
    children: ReactNode;
    className?: {
      modal: string;
      closeButton: string;
    };
    element: "dialog" | "drawer";
    id: string;
    isOpen: boolean;
    onClose?: () => void;
  };

export type DialogCommonProps = Omit<
  DialogBaseProps,
  "className" | "element" | "ariaLabel" | "title"
> &
  DialogIconProps &
  DialogTitleProps;
