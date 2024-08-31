import { Dispatch, SetStateAction } from "react";
import { Collapse, Text } from "../design-system";
import { PlanBenefitCard } from "./PlanBenefitCard";
import { MembershipPlan } from "./types/MembershipTypes";
import { MEMBERSHIP_COMPARE_PLANS } from "./utils/membershipConstants";

type PlanBenefitListProps = {
  isOpen: boolean;
  title: MembershipPlan;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const PlanBenefitsList = ({
  isOpen,
  title,
  setIsOpen,
}: PlanBenefitListProps) => {
  return (
    <div className="mt-medium md:hidden">
      <Collapse
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={
          <Text size="18" fontFamily="raleway" fontWeight="bold">
            {title} benefits
          </Text>
        }
        padding="medium"
        triggerNoMargin
      >
        <div className="pt-medium grid gap-medium">
          {MEMBERSHIP_COMPARE_PLANS.map(
            ({ availableColumns, ...benefitProps }) => (
              <PlanBenefitCard
                {...benefitProps}
                isAvailable={availableColumns.includes(title)}
              />
            )
          )}
        </div>
      </Collapse>
    </div>
  );
};
