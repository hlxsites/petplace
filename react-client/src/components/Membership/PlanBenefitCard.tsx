import { Card, Icon, Text } from "../design-system";

type PlanBenefitCardProps = {
  title: string;
  label: string;
  isAvailable: boolean;
};

export const PlanBenefitCard = ({
  title,
  label,
  isAvailable,
}: PlanBenefitCardProps) => {
  return (
    <Card>
      <div className="flex gap-small p-medium">
        <div>{renderIcon()}</div>
        <div className="grid">
          <Text size="18" fontFamily="raleway" fontWeight="bold">
            {title}
          </Text>
          <Text>{label}</Text>
        </div>
      </div>
    </Card>
  );

  function renderIcon() {
    return (
      <Icon
        className={isAvailable ? "text-green-300" : "text-red-300"}
        display={isAvailable ? "checkCircle" : "clearCircle"}
        size={24}
      />
    );
  }
};
