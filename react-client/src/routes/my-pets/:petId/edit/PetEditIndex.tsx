import { DisplayForm } from "~/components/design-system";
import { petProfileFormSchema } from "../form/petForm";
import { usePetProfileContext } from "../usePetProfileLayoutViewModel";

export const PetEditIndex = () => {
  const { petInfo } = usePetProfileContext();

  return (
    <DisplayForm
      onChange={(props) => {
        console.log("onChange values", props);
      }}
      onSubmit={({ event, values }) => {
        event.preventDefault();

        console.log("onSubmit values", values);
      }}
      schema={petProfileFormSchema}
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
  );
};
