import { ChangeEvent, createRef } from "react";
import { ASSET_IMAGES } from "~/assets";
import { Button } from "~/components/design-system";
import { PetModel } from "~/domain/models/pet/PetModel";

type PetImageInputProps = {
  pet: PetModel;
  onRemove: () => void;
  onSelectFile: (file: File) => void;
};

export const PetImageInput = ({ onSelectFile, pet }: PetImageInputProps) => {
  const inputFileRef = createRef<HTMLInputElement>();
  const petImage = pet.img
    ? pet.img
    : pet.species === "Dog"
      ? ASSET_IMAGES.squareDogAvatar
      : ASSET_IMAGES.squareCatAvatar;

  return (
    <div className="flex w-full flex-col flex-wrap items-center gap-base lg:flex-row lg:items-end">
      <img
        src={petImage}
        alt={`Pet: ${pet.name}`}
        className="h-[160px] w-[160px]"
      />
      <div className="flex w-full flex-col justify-end gap-small lg:w-fit">
        <input
          className="absolute h-0 w-0 opacity-0"
          id="pet-image-file-input"
          onChange={handleFileChange}
          ref={inputFileRef}
          type="file"
        />
        <Button
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
