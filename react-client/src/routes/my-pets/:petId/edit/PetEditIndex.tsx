import { usePetProfileContext } from "../PetProfileLayout";

export const PetEditIndex = () => {
  const { petInfo } = usePetProfileContext();

  return <p>Edit {petInfo.name}</p>;
};
