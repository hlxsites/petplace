import { forwardRef } from "react";

type InputHiddenProps = {
  id: string;
  value: string;
};

export const InputHidden = forwardRef<HTMLInputElement, InputHiddenProps>(
  ({ id, value }, ref) => {
    return <input ref={ref} id={id} name={id} type="hidden" value={value} />;
  }
);
