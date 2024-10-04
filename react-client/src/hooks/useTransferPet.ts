import { useSearchParams } from "react-router-dom";

const TRANSFER_PARAM = "transfer-pet";

export function useTransferPet() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isTransferringPet = !!searchParams.get(TRANSFER_PARAM);

  const onTransferPet = () => {
    searchParams.set(TRANSFER_PARAM, "t");
    setSearchParams(searchParams);
  };

  const onDismissTransferPet = () => {
    searchParams.delete(TRANSFER_PARAM);
    setSearchParams(searchParams);
  };

  return {
    isTransferringPet,
    onDismissTransferPet,
    onTransferPet,
  };
}
