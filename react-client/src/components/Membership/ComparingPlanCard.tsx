import { useCallback, useMemo } from "react";
import { Card, Icon, IconKeys, Text, Title } from "../design-system";
import {
  CA_AVAILABLE_PLANS,
  US_AVAILABLE_PLANS,
} from "./utils/comparingPlansConstants";

type ClassMap = Record<string, Record<number, string>>;

type ComparingPlanCardProps = {
  availableOnPlan: "all" | "bothLifetime" | "lifetimePlus";
  description: string;
  country: "us" | "ca";
  title: string;
};

export const ComparingPlanCard = ({
  availableOnPlan,
  country,
  description,
  title,
}: ComparingPlanCardProps) => {
  const availablePlans =
    country === "us" ? US_AVAILABLE_PLANS : CA_AVAILABLE_PLANS;

  const getIconClass = useCallback(
    (index: number) => {
      const defaultClass = "text-green-300";

      const usClasses: ClassMap = {
        bothLifetime: { 0: "text-red-300" },
        lifetimePlus: { 0: "text-red-300", 1: "text-red-300" },
      };

      const caClasses: ClassMap = {
        lifetimePlus: { 0: "text-red-300" },
      };

      const classMap = country === "us" ? usClasses : caClasses;

      return classMap?.[availableOnPlan]?.[index] || defaultClass;
    },
    [availableOnPlan, country]
  );

  const renderIcons = useMemo(() => {
    return availablePlans.map((plan, index) => {
      const iconClass = getIconClass(index);
      const iconDisplay: IconKeys = iconClass.includes("red")
        ? "clearCircle"
        : "checkCircle";

      return (
        <Icon
          key={`${country}-${plan}`}
          className={iconClass}
          display={iconDisplay}
          size={24}
        />
      );
    });
  }, [availablePlans, country, getIconClass]);

  return (
    <Card>
      <div className="flex-col-2 flex justify-between p-base">
        <div className="grid gap-xsmall">
          <Title level="h4">{title}</Title>
          <Text>{description}</Text>
        </div>
        <div className="flex place-items-center gap-[129px] px-xxlarge">
          {renderIcons}
        </div>
      </div>
    </Card>
  );
};
