import { ComponentProps } from "react";
import { MembershipCard } from "~/components/Membership/MembershipCard";

type TestSample = ComponentProps<
  typeof MembershipCard
>["membershipDescriptionOffers"];

const MEMBERSHIP_ANNUAL_SAMPLE: TestSample = [
  { offerLabel: "Direct connection to your pet's finder." },
  {
    icon: "clearCircle",
    offerLabel: "Pet Training Courses *.",
  },
];

const MEMBERSHIP_LIFETIME_SAMPLE: TestSample = [
  { offerLabel: "Get help finding your lost pet." },
  {
    icon: "clearCircle",
    offerLabel: "Lifetime warranty ID tag.",
  },
];

const MEMBERSHIP_CARD_OPTIONS: ComponentProps<typeof MembershipCard>[] = [
  {
    buttonLabel: "Get 1 Year Protection",
    price: "$45.95",
    priceInfo: "For the first year, $19.95/year thereafter",
    membershipDescriptionOffers: MEMBERSHIP_ANNUAL_SAMPLE,
    subTitle: "Keep Your Pet Safe All Year",
    title: "Annual Protection",
  },
  {
    buttonLabel: "Get the Best Value",
    cardProps: { backgroundColor: "bg-blue-100" },
    infoFooter: "* Complimentary for 1 year",
    price: "$99.95",
    priceInfo: "One-time fee",
    membershipDescriptionOffers: MEMBERSHIP_LIFETIME_SAMPLE,
    subTitle: "The Best Value Lost Pet Protection",
    title: "Lifetime",
  },
];

export const MembershipCardPlayground = () => {
  return (
    <div className="grid w-full grid-flow-row grid-cols-2 justify-center gap-large">
      {MEMBERSHIP_CARD_OPTIONS.map(({ ...props }) => (
        <MembershipCard key={props.title} {...props} />
      ))}
    </div>
  );
};
