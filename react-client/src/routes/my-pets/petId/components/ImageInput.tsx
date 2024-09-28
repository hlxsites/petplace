import { ChangeEvent, ReactNode } from "react";
import { Button } from "~/components/design-system";
import { PetModel } from "~/domain/models/pet/PetModel";

const inputId = "pet-image-file-input";

export const ImageInput = ({
  onRemove,
  onSelectFile,
  pet,
}: {
  pet: PetModel;
  onRemove: () => void;
  onSelectFile: (petId: string, file: File) => void;
}): ReactNode => {
  return (
    <div className="flex gap-base">
      <img
        src={pet.img}
        alt={`Pet: ${pet.name}`}
        className="h-[160px] w-[160px]"
      />
      <div className="flex flex-col justify-end gap-small">
        <Button variant="secondary" iconLeft="delete2" onClick={onRemove}>
          Remove photo
        </Button>
        <input
          type="file"
          id={inputId}
          className="absolute h-0 w-0 opacity-0"
          onChange={handleFileChange}
        />
        <Button
          variant="secondary"
          iconLeft="photoCamera"
          onClick={handleClick}
          fullWidth
        >
          Select photo
        </Button>
      </div>
    </div>
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target && event.target.files?.length)
      onSelectFile(pet.id, event.target.files[0]);
  }

  function handleClick() {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click();
    }
  }
};
