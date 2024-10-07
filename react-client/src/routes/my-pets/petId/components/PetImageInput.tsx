import { ChangeEvent, createRef } from "react";
import { Button } from "~/components/design-system";
import { PetModel } from "~/domain/models/pet/PetModel";

export const PetImageInput = ({
  onSelectFile,
  pet,
}: {
  pet: PetModel;
  onRemove: () => void;
  onSelectFile: (file: File) => void;
}) => {
  const inputFileRef = createRef<HTMLInputElement>();

  return (
    <div className="flex gap-base">
      <img
        src={pet.img}
        alt={`Pet: ${pet.name}`}
        className="h-[160px] w-[160px]"
      />
      <div className="flex flex-col justify-end gap-small">
        <input
          className="absolute h-0 w-0 opacity-0"
          id="pet-image-file-input"
          onChange={handleFileChange}
          ref={inputFileRef}
          type="file"
        />
        <Button
          fullWidth
          iconLeft="photoCamera"
          onClick={onSelectPhotoClick}
          variant="secondary"
        >
          Select photo
        </Button>
      </div>
    </div>
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target && event.target.files?.length)
      onSelectFile(event.target.files[0]);
  }

  function onSelectPhotoClick() {
    inputFileRef.current?.click();
  }
};
