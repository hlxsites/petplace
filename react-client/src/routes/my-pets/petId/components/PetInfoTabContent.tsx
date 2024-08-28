import { Text, TextSpan } from "~/components/design-system";
import { PetInfo } from "~/mocks/MockRestApiServer";

export type GetPetInfoTabProps = Omit<
  PetInfo,
  "id" | "img" | "isProtected" | "microchipNumber" | "name"
>;

export function PetInfoTabContent({
  age,
  breed,
  dateOfBirth,
  mixedBreed,
  sex,
  spayedNeutered,
  species,
}: GetPetInfoTabProps) {
  const getFields = [
    {
      label: "Age",
      value: age,
    },
    {
      label: "Species",
      value: species,
    },
    {
      label: "Sex",
      value: sex,
    },
    {
      label: "Breed",
      value: breed,
    },
    {
      label: "DOB",
      value: dateOfBirth,
    },
    {
      label: "Mixed breed",
      value: mixedBreed,
    },
    {
      label: "Spayed/Neutered",
      value:
        typeof spayedNeutered === "boolean"
          ? spayedNeutered
            ? "Yes"
            : "No"
          : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2" role="list">
      {getFields.map(({ label, value }) => (
        <div className="pb-xsmall" key={label} role="listitem">
          <Text size="14">
            <TextSpan fontFamily="raleway" fontWeight="bold">
              {label}:
            </TextSpan>{" "}
            {value ?? ""}
          </Text>
        </div>
      ))}
    </div>
  );
}
