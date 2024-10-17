import { useState } from "react";
import { Button } from "~/components/design-system/button/Button";
import { PetCardRecord } from "~/components/Pet/PetCardRecord";

export const PetCardRecordPlayground = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="grid max-w-[300px] gap-xlarge">
      <div className="grid gap-small">
        <PetCardRecord
          document={{
            id: "dog-image",
            fileName: "Dog image",
            fileType: "jpg",
          }}
        />

        <PetCardRecord
          document={{
            id: "github-pdf",
            fileName: "PDF gitHub",
            fileType: "pdf",
          }}
        />
      </div>

      <Button onClick={() => setIsUploading((prev) => !prev)}>Upload</Button>
      {isUploading && (
        <PetCardRecord
          document={{
            id: "upload-test",
            fileName: "Upload test",
            fileType: "doc",
          }}
          isUploadingFile={isUploading}
        />
      )}
    </div>
  );
};
