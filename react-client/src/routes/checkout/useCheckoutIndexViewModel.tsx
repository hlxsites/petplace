import { LoaderFunction, useLoaderData } from "react-router-dom";
import { usePlansFeatures } from "~/components/Membership/hooks/usePlansFeatures";
import { Locale } from "~/components/Membership/types/MembershipTypes";
import { getProductsList } from "~/mocks/MockRestApiServer";
import { LoaderData } from "~/types/LoaderData";

export const loader = (() => {
  const locale: Locale = "us";
  return {
    locale: locale as Locale,
    products: getProductsList(),
  };
}) satisfies LoaderFunction;

export const useCheckoutIndexViewModel = () => {
  const { products, locale } = useLoaderData() as LoaderData<typeof loader>;
  const {
    availablePlans,
    renderMobileVersion,
    isCanadaLocale,
    plans,
  } = usePlansFeatures(locale);

  return {
    availablePlans,
    renderMobileVersion,
    isCanadaLocale,
    plans,
    products,
  };
};
