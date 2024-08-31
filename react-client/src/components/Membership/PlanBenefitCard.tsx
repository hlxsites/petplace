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
    <div>
      <Card>
      <div className="flex gap-small p-medium">
        <div>{renderIcon()}</div>
        <div>
          <Text size="18" fontFamily="raleway" fontWeight="bold">
            {title}
          </Text>
          <Text>{label}</Text>
        </div>
      </div>
    </Card>
    </div>
  );

  function renderIcon() {
    return (
      <Icon
        display={isAvailable ? "checkCircle" : "clearCircle"}
        className={isAvailable ? "text-green-300" : "text-red-300"}
        size={24}
      />
    );
  }
};
