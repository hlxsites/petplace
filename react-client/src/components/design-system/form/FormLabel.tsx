import { classNames } from "~/util/styleUtil";

const FormLabel = ({ className, ...props }: JSX.IntrinsicElements["label"]) => {
  return (
    <label
      className={classNames("font-franklin text-base font-medium", className)}
      data-testid="FormLabel"
      {...props}
    />
  );
};

export default FormLabel;
