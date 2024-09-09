import { Card, DisplayForm, Title } from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { editPetProfileFormSchema } from "../form/petForm";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";

export const PetEditIndex = () => {
  const { petInfo } = usePetProfileContext();

  return (
    <>
      <Header
        backButtonTo={PET_PROFILE_FULL_ROUTE(petInfo.id)}
        pageTitle="Edit Pet Profile"
      />
      <Card padding="xlarge">
        <Title level="h3">Pet info</Title>
        <div className="h-xxlarge" />
        <DisplayForm
          onChange={(props) => {
            console.log("onChange values", props);
          }}
          onSubmit={({ event, values }) => {
            event.preventDefault();

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
            ...petInfo,
          }}
        />
      </Card>
    </>
  );
};
