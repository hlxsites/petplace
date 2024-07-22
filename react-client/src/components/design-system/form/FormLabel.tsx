import { classNames } from "~/util/styleUtil";

const FormLabel = ({ className, ...props }: JSX.IntrinsicElements["label"]) => {
  return (
    <label
      className={classNames("label label-text", className)}
      data-testid="FormLabel"
      {...props}
    />
  );
};

export default FormLabel;
