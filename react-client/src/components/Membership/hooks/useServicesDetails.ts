import { useSearchParams } from "react-router-dom";
import { getServicesList } from "~/mocks/MockRestApiServer";

const SERVICES_PARAM = "info";
const SERVICES_KEY = "services";

export function useServicesDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get(SERVICES_PARAM);

  const items = param === SERVICES_KEY ? getServicesList() : [];

  function goBack() {
    searchParams.delete(SERVICES_PARAM);
    setSearchParams(searchParams);
  }

  function openServiceDetails() {
    searchParams.set(SERVICES_PARAM, SERVICES_KEY);
    setSearchParams(searchParams);
  }

  return {
    items,
    goBack,
    openServiceDetails,
  };
}
