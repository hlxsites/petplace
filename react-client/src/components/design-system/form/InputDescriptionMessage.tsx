import { Icon } from "../icon/Icon";

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
      <span className="ml-small block text-xs">{message}</span>
    </span>
  );
};
