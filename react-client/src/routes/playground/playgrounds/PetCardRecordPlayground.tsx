import { useState } from "react";
import { Button } from "~/components/design-system/button/Button";
import { PetCardRecord } from "~/components/Pet/PetCardRecord";

export const PetCardRecordPlayground = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="grid max-w-[200px] gap-xlarge">
      <div className="grid gap-small">
        <PetCardRecord
          fileName="Dog image"
          downloadPath="https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg"
          fileType="jpg"
        />

        <PetCardRecord
          fileName="PDF gitHub"
          downloadPath="https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf"
          fileType="pdf"
        />
      </div>

      <Button onClick={() => setIsUploading((prev) => !prev)}>Upload</Button>
      {isUploading && (
        <PetCardRecord fileName="Upload test" isUploadingFile={isUploading} />
      )}
    </div>
  );
};
