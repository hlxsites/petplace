type InputErrorMessageProps = {
  id: string;
  message?: string;
};

export const InputErrorMessage = ({ id, message }: InputErrorMessageProps) => {
  if (!message) return null;

  return (
    <span className="label-text-alt animate-slide-top text-red-700" id={id}>
      {message}
    </span>
  );
};
