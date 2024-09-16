import { Text, TextSpan } from "~/components/design-system";
import { PetModel } from "~/domain/models/pet/PetModel";
import { parseDate } from "~/util/dateUtils";
import { getAnimalSex } from "~/util/getAnimalDetails";

export type GetPetInfoTabProps = Omit<
  PetModel,
  "id" | "img" | "isProtected" | "microchip" | "name"
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
      value: getAnimalSex(sex),
    },
    {
      label: "Breed",
      value: breed,
    },
    {
      label: "DOB",
      value: parseDate(dateOfBirth),
    },
    {
      label: "Mixed breed",
      value: renderBooleanField(mixedBreed),
    },
    {
      label: "Spayed/Neutered",
      value: renderBooleanField(spayedNeutered),
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

function renderBooleanField(field?: boolean) {
  return typeof field === "boolean" ? (field ? "Yes" : "No") : "";
}
