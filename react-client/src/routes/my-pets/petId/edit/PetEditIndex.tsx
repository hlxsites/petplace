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

export const PetEditIndex = () => {
  const { petInfo } = usePetProfileContext();

  return <SuspenseAwait resolve={petInfo}>{renderPetForm}</SuspenseAwait>;

  function renderPetForm(pet: PetModel | null) {
    invariant(pet, "Pet not found");

    return (
      <>
        <Header
          backButtonTo={PET_PROFILE_FULL_ROUTE(pet.id)}
          pageTitle="Edit Pet Profile"
        />
        <Card padding="xlarge">
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
        </Card>
      </>
    );
  }
};
