import { type ComponentProps, type ReactNode } from "react";
import { classNames } from "~/util/styleUtil";
import FormLabel from "./FormLabel";
import { InputDescriptionMessage } from "./InputDescriptionMessage";
import { InputErrorMessage } from "./InputErrorMessage";
import { type InputWithoutFormBuilderProps } from "./types/formTypes";

type ChildrenProps = {
  hasError: boolean;
  inputProps: Record<string, unknown>;
};

type InputAccessibilityWrapperProps = InputWithoutFormBuilderProps & {
  children: (props: ChildrenProps) => ReactNode;
  labelProps?: ComponentProps<typeof FormLabel>;
};

export const InputAccessibilityWrapper = ({
  className,
  children,
  description,
  disabled,
  errorMessage,
  hideLabel,
  id,
  label,
  labelProps,
  required,
}: InputAccessibilityWrapperProps) => {
  const hasError = !!errorMessage;
  const hasDescription = !!description;

  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  const inputProps: Record<string, unknown> = {
    disabled,
    id,
    name: id,
    "aria-invalid": hasError ? true : undefined,
    "aria-describedby": hasDescription ? descriptionId : undefined,
    "aria-errormessage": hasError ? errorId : undefined,
    "aria-label": hideLabel ? label : undefined,
    required,
  };

  return (
    <div className={classNames("flex flex-col gap-xsmall", className)}>
      {!hideLabel && (
        <FormLabel htmlFor={id} {...labelProps}>
          {required ? label : `${label} (optional)`}
        </FormLabel>
      )}
      {children({
        hasError,
        inputProps,
      })}
      {(hasDescription || hasError) && (
        <>
          <InputDescriptionMessage id={descriptionId} message={description} />
          <InputErrorMessage id={errorId} message={errorMessage} />
        </>
      )}
    </div>
  );
};
