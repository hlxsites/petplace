import { useState } from "react";
import { Collapse, Title } from "~/components/design-system";
import { useCheckoutIndexViewModel } from "~/routes/checkout/useCheckoutIndexViewModel";
import { MembershipComparingPlanTable } from "../MembershipComparingPlanTable";
import {
  MEMBERSHIP_COMPARE_PLANS,
  MEMBERSHIP_COMPARING_PLANS_BUTTONS,
} from "../utils/membershipConstants";

export const MembershipComparingPlansSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { availablePlans, isCanadaLocale } = useCheckoutIndexViewModel();

  return (
    <div className="hidden w-full md:block">
      <Collapse
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={<Title level="h3">Compare plans</Title>}
        padding="large"
      >
        <MembershipComparingPlanTable
          actions={getActionButtons()}
          columns={availablePlans}
          rows={MEMBERSHIP_COMPARE_PLANS}
        />
      </Collapse>
    </div>
  );

  function getActionButtons() {
    return isCanadaLocale
      ? MEMBERSHIP_COMPARING_PLANS_BUTTONS.slice(1)
      : MEMBERSHIP_COMPARING_PLANS_BUTTONS;
  }
};
