import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Card,
  DisplayUncontrolledForm,
  Title,
} from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { PetModel } from "~/domain/models/pet/PetModel";
import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { invariant } from "~/util/invariant";
import { editPetProfileFormSchema } from "../form/petForm";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";
import { ImageInput } from "../components/ImageInput";

export const PetEditIndex = () => {
  const { petInfo, onRemoveImage, onSelectImage } = usePetProfileContext();

  return (
    <SuspenseAwait resolve={petInfo}>
      {(pet) => {
        invariant(pet, "Pet not found");
        return (
          <>
            <Header
              backButtonTo={PET_PROFILE_FULL_ROUTE(pet.id)}
              pageTitle="Edit Pet Profile"
            />
            <Card padding="xlarge">
              {renderPetImage(pet)}
              {renderPetForm(pet)}
            </Card>
          </>
        );
      }}
    </SuspenseAwait>
  );

  function renderPetImage(pet: PetModel) {
    return (
      <>
        <Title level="h3">Profile Picture</Title>
        <div className="h-base" />
        <div className="mb-xxxlarge">
          <ImageInput pet={pet} onRemove={onRemoveImage} onSelectFile={onSelectImage}/>
        </div>
      </>
    );
  }

  function renderPetForm(pet: PetModel) {
    return (
      <>
        <Title level="h3">Pet info</Title>
        <div className="h-xxlarge" />
        <DisplayUncontrolledForm
          onSubmit={({ values }) => {
            console.log("onSubmit values", values);
          }}
          schema={editPetProfileFormSchema}
          variables={{
            // This could come from an API request, for example
            breedOptions: [
              "Poodle",
              "Golden Retriever",
              "Labrador",
              "Pug",
              "Beagle",
            ],
            breedTypeOptions: [],
            colorOptions: ["Black", "White", "Brown", "Grey", "Golden"],
          }}
          // @ts-expect-error - This is a mock data
          values={{
            ...pet,
          }}
        />
      </>
    );
  }
};
