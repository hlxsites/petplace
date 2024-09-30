import { forwardRef, type ChangeEvent } from "react";

type InputHiddenProps = {
  id: string;
  value: string;
  onChange: (newValue: string) => void;
};

export const InputHidden = forwardRef<HTMLInputElement, InputHiddenProps>(
  ({ id, value, onChange }, ref) => {
    const handleOnChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange(target.value);
    };

    return (
      <input
        ref={ref}
        id={id}
        name={id}
        type="hidden"
        value={value}
        onChange={handleOnChange}
      />
    );
  }
);
