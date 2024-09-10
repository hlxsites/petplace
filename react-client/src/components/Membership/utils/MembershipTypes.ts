import { ButtonProps, IconKeys } from "~/components/design-system";
import { CardProps } from "~/components/design-system/types/CardTypes";

export type MembershipDescriptionOffer = {
  icon?: IconKeys;
  offerLabel: string;
};

export type MembershipInfoCard = {
  buttonLabel: string;
  cardProps?: Omit<CardProps, "children">;
  infoFooter?: string;
  membershipDescriptionOffers?: MembershipDescriptionOffer[];
  price: string;
  priceInfo: string;
  subTitle: string;
  title: MembershipPlan;
};

export type MembershipPlan = "Annual Protection" | "Lifetime" | "Lifetime Plus";

export type Locale = "us" | "ca";

export type TableActions = {
  label: string;
  variant?: ButtonProps["variant"];
};
