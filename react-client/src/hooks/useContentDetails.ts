import { useSearchParams } from "react-router-dom";
import { PET_WATCH_SERVICES_DETAILS } from "~/routes/my-pets/petId/utils/petServiceDetails";

const SERVICE_PARAM = "item";

export const useContentDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedContent = searchParams.get(SERVICE_PARAM);
  const contentDetails = PET_WATCH_SERVICES_DETAILS.find(
    ({ id }) => id === selectedContent
  );

  function handleContentChange(label?: string) {
    return () => {
      if (label) return setSelectedContent(label);
      resetContent();
    };
  }

  function setSelectedContent(value: string) {
    searchParams.set(SERVICE_PARAM, value);
    setSearchParams(searchParams);
  }

  function resetContent() {
    searchParams.delete(SERVICE_PARAM);
    setSearchParams(searchParams);
  }

  return {
    handleContentChange,
    contentDetails,
  };
};
