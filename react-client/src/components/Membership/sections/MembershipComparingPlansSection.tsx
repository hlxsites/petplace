import { useState } from "react";
import { Collapse, Title } from "~/components/design-system";
import { useCheckoutIndexViewModel } from "~/routes/checkout/useCheckoutIndexViewModel";
import { MembershipComparingPlanTable } from "../MembershipComparingPlanTable";
import { MEMBERSHIP_COMPARE_PLANS } from "../utils/membershipConstants";

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
