import { Dispatch, SetStateAction } from "react";
import { MembershipInfo } from "~/domain/checkout/CheckoutModels";
import { MEMBERSHIP_COMPARE_PLANS } from "~/domain/useCases/checkout/utils/checkoutHardCodedData";
import { Collapse, Text } from "../design-system";
import { PlanBenefitCard } from "./PlanBenefitCard";

type PlanBenefitListProps = Pick<
  MembershipInfo,
  "hardCodedPlanId" | "title"
> & {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const PlanBenefitsList = ({
  hardCodedPlanId,
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
                isAvailable={availableColumns.includes(hardCodedPlanId)}
              />
            )
          )}
        </div>
      </Collapse>
    </div>
  );
};
