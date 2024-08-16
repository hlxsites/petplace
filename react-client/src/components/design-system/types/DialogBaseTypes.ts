import { ComponentProps, CSSProperties, ReactNode } from "react";
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
    width?: CSSProperties["width"];
  };

export type DialogCommonProps = Omit<
  DialogBaseProps,
  "className" | "element" | "ariaLabel" | "title"
> &
  DialogIconProps &
  DialogTitleProps;
