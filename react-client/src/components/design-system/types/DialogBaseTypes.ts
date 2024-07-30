import { ReactNode } from "react";

export type TitleProps =
  | {
      ariaLabel?: string;
      title: string;
    }
  | {
      ariaLabel: string;
      title?: string;
    };

export type DialogBaseProps = TitleProps & {
  children: ReactNode;

  className?: {
    modal: string;
    closeButton: string;
  };
  element: "dialog" | "drawer";
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

export type DialogCommonProps = Omit<
  DialogBaseProps,
  "className" | "element" | "ariaLabel" | "title"
> &
  TitleProps;
