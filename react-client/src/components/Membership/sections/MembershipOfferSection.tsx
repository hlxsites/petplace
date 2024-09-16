import { useWindowWidth } from "~/hooks/useWindowWidth";
import { MembershipCard } from "../MembershipCard";
import { MEMBERSHIP_CARD_OPTIONS } from "../utils/membershipConstants";
import { Carousel } from "~/components/design-system";

export const MembershipOfferSection = () => {
  const shouldRenderContentInCarousel = useWindowWidth() < 768;

  const membershipCards = renderMembershipCards();

  return (
    <>
      <div
        className="hidden w-full grid-flow-row grid-cols-3 justify-center gap-base md:grid"
        role="region"
      >
        {membershipCards}
      </div>
      {shouldRenderContentInCarousel && (
        <Carousel ariaLabel="Membership carousel" items={membershipCards} />
      )}
    </>
  );

  function renderMembershipCards() {
    return MEMBERSHIP_CARD_OPTIONS.map(({ ...props }) => (
      <MembershipCard key={props.title} {...props} />
    ));
  }
};
