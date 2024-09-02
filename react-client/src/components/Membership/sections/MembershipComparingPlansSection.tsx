import { Collapse, Title } from "~/components/design-system";
import { MembershipComparingPlanTable } from "../MembershipComparingPlanTable";
import { useState } from "react";
import { Locales } from "../types/MembershipTypes";
import {
  CA_MEMBERSHIP_PLANS,
  MEMBERSHIP_COMPARE_PLANS,
  MEMBERSHIP_COMPARING_PLANS_BUTTONS,
  US_MEMBERSHIP_PLANS,
} from "../utils/membershipConstants";

type MembershipComparingPlansSectionProps = {
  locale: Locales;
};

export const MembershipComparingPlansSection = ({
  locale,
}: MembershipComparingPlansSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCanadaLocale = locale === "ca";

  return (
    <div className="w-full">
      <Collapse
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={<Title level="h3">Compare plans</Title>}
      >
        <MembershipComparingPlanTable
          actions={getActionButtons()}
          columns={getMembershipTitles()}
          rows={MEMBERSHIP_COMPARE_PLANS}
        />
      </Collapse>
    </div>
  );

  function getMembershipTitles() {
    return isCanadaLocale ? CA_MEMBERSHIP_PLANS : US_MEMBERSHIP_PLANS;
  }

  function getActionButtons() {
    return isCanadaLocale
      ? MEMBERSHIP_COMPARING_PLANS_BUTTONS.slice(1)
      : MEMBERSHIP_COMPARING_PLANS_BUTTONS;
  }
};
