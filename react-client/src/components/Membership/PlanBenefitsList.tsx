import { Dispatch, SetStateAction } from "react";
import { Collapse, Text } from "../design-system";
import { PlanBenefitCard } from "./PlanBenefitCard";

import { MEMBERSHIP_COMPARE_PLANS } from "./utils/membershipConstants";
import { MembershipPlan } from "~/domain/useCases/checkout/GetCheckoutUseCase";

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
        <div className="grid gap-medium pt-medium">
          {MEMBERSHIP_COMPARE_PLANS.map(
            ({ availableColumns, ...benefitProps }) => (
              <PlanBenefitCard
                {...benefitProps}
                key={benefitProps.title}
                isAvailable={availableColumns.includes(title)}
              />
            )
          )}
        </div>
      </Collapse>
    </div>
  );
};
