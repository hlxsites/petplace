import { Title } from "~/components/design-system";
import { usePetProfileIndexViewModel } from "./usePetProfileIndexViewModel";

export const PetProfileIndex = () => {
  const { petInfo } = usePetProfileIndexViewModel();

  return (
    <>
      <Title>Pet Profile</Title>
      <div>{petInfo}</div>
    </>
  );
};
