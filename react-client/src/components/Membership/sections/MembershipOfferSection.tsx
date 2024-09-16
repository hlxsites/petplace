import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Carousel } from "~/components/design-system";
import { useCheckoutIndexViewModel } from "~/routes/checkout/useCheckoutIndexViewModel";
import { MembershipCard } from "../MembershipCard";
import { PlanBenefitsList } from "../PlanBenefitsList";

export const MembershipOfferSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { plans, renderMobileVersion } = useCheckoutIndexViewModel();
  const membershipCards = renderMembershipCards();

  return (
    <>
      <div
        className="hidden w-full grid-flow-row grid-cols-3 justify-center gap-xxlarge md:grid"
        role="region"
      >
        {membershipCards}
      </div>
      {renderMobileVersion && (
        <Carousel ariaLabel="Membership carousel" items={membershipCards} />
      )}
    </>
  );

  function renderMembershipCards() {
    return plans.map(({ title, ...props }) => (
      <Fragment key={title}>
        <MembershipCard key={title} title={title} {...props} />
        <PlanBenefitsList isOpen={isOpen} title={title} setIsOpen={setIsOpen} />
      </Fragment>
    ));
  }
};
