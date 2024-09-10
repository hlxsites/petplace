import { useWindowWidth } from "~/hooks/useWindowWidth";
import {
  CA_MEMBERSHIP_PLANS,
  MEMBERSHIP_CARD_OPTIONS,
  US_MEMBERSHIP_PLANS,
} from "../utils/membershipConstants";
import { Locale } from "../utils/MembershipTypes";

export const usePlansFeatures = (locale: Locale) => {
  const renderMobileVersion = useWindowWidth() < 768;
  const isCanadaLocale = locale === "ca";
  const availablePlans = isCanadaLocale
    ? CA_MEMBERSHIP_PLANS
    : US_MEMBERSHIP_PLANS;

  const plans = MEMBERSHIP_CARD_OPTIONS.filter(({ title }) =>
    availablePlans.includes(title)
  );

  return {
    availablePlans,
    renderMobileVersion,
    isCanadaLocale,
    plans,
  };
};
