import { usePetProfileContext } from "../usePetProfileLayoutViewModel";

export const PetEditIndex = () => {
  const { petInfo } = usePetProfileContext();

  return <p>Edit {petInfo.name}</p>;
};
