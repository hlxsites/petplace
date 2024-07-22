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
    <span className="label-text-alt" id={id}>
      {message}
    </span>
  );
};
