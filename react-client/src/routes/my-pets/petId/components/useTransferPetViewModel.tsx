import { useSearchParams } from "react-router-dom";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";

const TRANSFER_PET_PARAM = "transfer-pet";

export function useTransferPetViewModel() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isDialogOpen =
    searchParams.get(CONTENT_PARAM_KEY) === TRANSFER_PET_PARAM;

  const onOpenDialog = () => {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set(CONTENT_PARAM_KEY, TRANSFER_PET_PARAM);
      return nextSearchParams;
    });
  };

  const onCloseDialog = () => {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.delete(CONTENT_PARAM_KEY);
      return nextSearchParams;
    });
  };

  return {
    isDialogOpen,
    onCloseDialog,
    onOpenDialog,
  };
}
