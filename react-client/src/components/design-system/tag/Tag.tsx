import { Icon, Text } from "~/components/design-system";
import { classNames } from "~/util/styleUtil";

export type TagProps = {
  fullWidth?: boolean;
  label: string;
  tagStatus: "info" | "success" | "warning";
};

export const Tag = ({ fullWidth, label, tagStatus }: TagProps) => {
  const containerClass = classNames(
    "flex items-center gap-small rounded-lg px-small py-xsmall",
    {
      "bg-blue-100 text-blue-500": tagStatus === "info",
      "bg-green-100 text-green-500": tagStatus === "success",
      "bg-yellow-100 text-yellow-500": tagStatus === "warning",
      "w-full justify-center": fullWidth,
    }
  );

  const textColorClass = (() => {
    if (tagStatus === "success") return "green-500";
    if (tagStatus === "warning") return "yellow-500";
    return "blue-500";
  })();

  return (
    <div className={containerClass}>
      <Icon display="ellipse" size={8} />
      <Text color={textColorClass} fontWeight="medium" size="16">
        {label}
      </Text>
    </div>
  );
};
