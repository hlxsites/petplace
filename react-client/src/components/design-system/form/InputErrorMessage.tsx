type InputErrorMessageProps = {
  id: string;
  message?: string;
};

export const InputErrorMessage = ({ id, message }: InputErrorMessageProps) => {
  if (!message) return null;

  return (
    <span className="text-text-danger-default block text-xs" id={id}>
      {message}
    </span>
  );
};
