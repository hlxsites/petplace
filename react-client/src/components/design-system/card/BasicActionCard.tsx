import { Button, ButtonProps } from "../button/Button";
import { Text } from "../text/Text";
import { Title, TitleProps } from "../text/Title";
import { TextProps } from "../types/TextTypes";
import { Card } from "./Card";

type BasicActionCardProps = {
  buttonLabel: string;
  buttonProps?: Omit<ButtonProps, "children">;
  message?: string;
  textProps?: Omit<TextProps, "children">;
  title?: string;
  titleProps?: Omit<TitleProps, "children">;
};

export const BasicActionCard = ({
  buttonLabel,
  buttonProps,
  message,
  textProps,
  title,
  titleProps,
}: BasicActionCardProps) => {
  return (
    <Card role="region">
      <div className="grid gap-large p-xxlarge">
        <div className="grid gap-small">
          <Title level="h3" {...titleProps}>
            {title}
          </Title>
          <Text {...textProps}>{message}</Text>
        </div>
        <Button {...buttonProps}>{buttonLabel}</Button>
      </div>
    </Card>
  );
};
