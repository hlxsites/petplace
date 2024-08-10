import { useState } from "react";
import { Button } from "~/components/design-system/button/Button";
import { PetCardRecord } from "~/components/Pet/PetCardRecord";

export const PetCardRecordPlayground = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="grid max-w-[300px] gap-xlarge">
      <div className="grid gap-small">
        <PetCardRecord
          record={{
            id: "dog-image",
            downloadPath:
              "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
            fileName: "Dog image",
            fileType: "jpg",
          }}
        />

        <PetCardRecord
          record={{
            id: "github-pdf",
            downloadPath:
              "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
            fileName: "PDF gitHub",
            fileType: "pdf",
          }}
        />
      </div>

      <Button onClick={() => setIsUploading((prev) => !prev)}>Upload</Button>
      {isUploading && (
        <PetCardRecord
          record={{
            id: "upload-test",
            fileName: "Upload test",
          }}
          isUploadingFile={isUploading}
        />
      )}
    </div>
  );
};
