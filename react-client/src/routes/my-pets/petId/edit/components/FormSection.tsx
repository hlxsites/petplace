import {
  Card,
  DisplayForm,
  DisplayFormProps,
  Title,
} from "~/components/design-system";
import { PetModel } from "~/domain/models/pet/PetModel";
import { PetImageInput } from "../../components/PetImageInput";

type FormSectionProps = {
  pet: PetModel;
  handleReset: () => void;
  onRemoveImage: () => void;
  onSelectImage: (file: File) => void;
  form: DisplayFormProps;
};

export const FormSection = ({
  pet,
  handleReset,
  onRemoveImage,
  onSelectImage,
  form,
}: FormSectionProps) => {
  return (
    <Card padding="xlarge">
      {renderPetImage(pet)}
      {renderPetForm()}
    </Card>
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
        <DisplayForm {...form} onReset={handleReset} />
      </>
    );
  }
};
