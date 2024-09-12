import { LoaderFunction, useLoaderData } from "react-router-typesafe";
import { usePlansFeatures } from "~/components/Membership/hooks/usePlansFeatures";
import { Locale } from "~/components/Membership/utils/MembershipTypes";

import { getProductsList } from "~/mocks/MockRestApiServer";

export const loader = (() => {
  const locale: Locale = "us";
  return {
    locale: locale as Locale,
    products: getProductsList(),
  };
}) satisfies LoaderFunction;

export const useCheckoutIndexViewModel = () => {
  const { products, locale } = useLoaderData<typeof loader>();
  const { availablePlans, renderMobileVersion, isCanadaLocale, plans } =
    usePlansFeatures(locale);

  return {
    availablePlans,
    renderMobileVersion,
    isCanadaLocale,
    plans,
    products,
  };
};
