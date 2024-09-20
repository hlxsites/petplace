import { Icon } from "../icon/Icon";
import { Text } from "../text/Text";

type InputDescriptionMessageProps = {
  id: string;
  message?: string;
};

export const InputDescriptionMessage = ({
  id,
  message,
}: InputDescriptionMessageProps) => {
  if (!message) return null;

  return (
    <span className="text-background-color-tertiary flex" id={id}>
      <Icon display="information" size={16} />
      <Text>{message}</Text>
    </span>
  );
};
