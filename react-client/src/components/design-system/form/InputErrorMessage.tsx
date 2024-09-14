type InputErrorMessageProps = {
  id: string;
  message?: string | null;
};

export const InputErrorMessage = ({ id, message }: InputErrorMessageProps) => {
  if (!message) return null;

  return (
    <span className="text-xs block text-text-danger-default" id={id}>
      {message}
    </span>
  );
};
