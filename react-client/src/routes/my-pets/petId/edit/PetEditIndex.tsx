import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Card, DisplayForm, Title } from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { PetModel } from "~/domain/models/pet/PetModel";
import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { invariant } from "~/util/invariant";
import { PetImageInput } from "../components/PetImageInput";
import { usePetEditViewModel } from "./usePetEditViewModel";

export const PetEditIndex = () => {
  const { form, petInfoQuery, onRemoveImage, onSelectImage } =
    usePetEditViewModel();

  return <SuspenseAwait resolve={petInfoQuery}>{renderMain}</SuspenseAwait>;

  function renderMain(pet: PetModel | null) {
    invariant(pet, "Pet not found");

    return (
      <>
        <Header
          backButtonTo={PET_PROFILE_FULL_ROUTE(pet.id)}
          pageTitle="Edit Pet Profile"
        />
        <Card padding="xlarge">
          {renderPetImage(pet)}
          {renderPetForm()}
        </Card>
      </>
    );

    function renderPetImage(pet: PetModel) {
      return (
        <>
          <Title level="h3">Profile Picture</Title>
          <div className="h-base" />
          <div className="mb-xxxlarge">
            <PetImageInput
              pet={pet}
              onRemove={onRemoveImage}
              onSelectFile={onSelectImage}
            />
          </div>
        </>
      );
    }

    function renderPetForm() {
      return (
        <>
          <Title level="h3">Pet info</Title>
          <div className="h-xxlarge" />
          <DisplayForm {...form} />
        </>
      );
    }
  }
};
