import { LinkButton } from "../button/LinkButton";
import { Text } from "../text/Text";
import { Title } from "../text/Title";
import { Card } from "./Card";

type BasicActionCardProps = {
  buttonLabel: string;
  buttonLink: string;
  message?: string;
  title?: string;
};

export const BasicActionCard = ({
  buttonLabel,
  buttonLink,
  message,
  title,
}: BasicActionCardProps) => {
  return (
    <Card role="region">
      <div className="grid gap-large p-xxlarge">
        <div className="grid gap-small">
          <Title level="h3">{title}</Title>
          <Text size="16">{message}</Text>
        </div>
        <LinkButton to={buttonLink} variant="secondary">
          {buttonLabel}
        </LinkButton>
      </div>
    </Card>
  );
};
