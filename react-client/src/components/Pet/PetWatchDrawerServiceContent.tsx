import { useContentDetails } from "~/hooks/useContentDetails";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";

export const PetWatchDrawerServiceContent = () => {
  const { handleContentChange, contentDetails } = useContentDetails();

  return (
    <>
      <PetWatchDrawerHeader
        contentDetails={contentDetails}
        onClick={handleContentChange()}
      />
      <PetWatchDrawerBody
        contentDetails={contentDetails}
        onClick={handleContentChange}
      />
    </>
  );
};
