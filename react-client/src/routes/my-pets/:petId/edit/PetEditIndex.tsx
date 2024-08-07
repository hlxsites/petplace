import { Card, DisplayForm, Title } from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { editPetProfileFormSchema } from "../form/petForm";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";

export const PetEditIndex = () => {
  const { petInfo } = usePetProfileContext();

  return (
    <>
      <Header pageTitle="Edit Pet Profile" shouldRenderBackButton />
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
          values={{
            ...petInfo,
          }}
        />
      </Card>
    </>
  );
};
