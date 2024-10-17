import { useState } from "react";
import { Collapse, Title } from "~/components/design-system";
import { MEMBERSHIP_COMPARE_PLANS } from "~/domain/useCases/checkout/utils/checkoutHardCodedData";
import { useCheckoutIndexViewModel } from "~/routes/checkout/useCheckoutIndexViewModel";
import { MembershipComparingPlanTable } from "../MembershipComparingPlanTable";

export const MembershipComparingPlansSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { plans } = useCheckoutIndexViewModel();

  if (!plans.length) return null;

  return (
    <div className="hidden w-full md:block">
      <Collapse
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={<Title level="h3">Compare plans</Title>}
        padding="large"
      >
        <MembershipComparingPlanTable
          plans={plans}
          rows={MEMBERSHIP_COMPARE_PLANS}
        />
      </Collapse>
    </div>
  );
};
