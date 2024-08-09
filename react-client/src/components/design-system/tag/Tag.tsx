import { Icon, Text } from "~/components/design-system";
import { classNames } from "~/util/styleUtil";

export type TagProps = {
  label: string;
  tagStatus: "info" | "success" | "warning";
};

export const Tag = ({ label, tagStatus }: TagProps) => {
  const containerClass = classNames(
    "flex max-w-max items-center gap-small rounded-lg px-small py-xsmall",
    {
      "bg-blue-100 text-blue-500": tagStatus === "info",
      "bg-green-100 text-green-500": tagStatus === "success",
      "bg-yellow-100 text-yellow-500": tagStatus === "warning",
    }
  );

  const textColorClass = (() => {
    if (tagStatus === "success") return "text-green-500";
    if (tagStatus === "warning") return "text-yellow-500";
    return "text-blue-500";
  })();

  return (
    <div className={containerClass}>
      <Icon display="ellipse" size={8} />
      <Text color={textColorClass} fontWeight="medium" size="base">
        {label}
      </Text>
      {tagStatus !== "success" && <Icon display="information" size={16} />}
    </div>
  );
};
