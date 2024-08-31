import { IconKeys } from "~/components/design-system";
import { CardProps } from "~/components/design-system/types/CardTypes";
import { MembershipPlan } from "../types/MembershipTypes";

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
