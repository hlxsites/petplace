import { LoaderFunction, useLoaderData } from "react-router-typesafe";
import { usePlansFeatures } from "~/components/Membership/hooks/usePlansFeatures";
import { Locale } from "~/components/Membership/utils/MembershipTypes";

import { invariantResponse } from "~/util/invariant";

export const loader = (({ request }) => {
  const url = new URL(request.url);
  const petId = url.searchParams.get("petId");
  invariantResponse(petId, "petId param is required");

  const locale: Locale = "us";
  return {
    locale: locale as Locale,
  };
}) satisfies LoaderFunction;

export const useCheckoutIndexViewModel = () => {
  const { locale } = useLoaderData<typeof loader>();
  const { availablePlans, renderMobileVersion, isCanadaLocale, plans } =
    usePlansFeatures(locale);

  return {
    availablePlans,
    renderMobileVersion,
    isCanadaLocale,
    plans,
  };
};
