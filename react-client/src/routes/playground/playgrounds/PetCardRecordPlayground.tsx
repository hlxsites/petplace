import { ComponentProps, useState } from "react";
import { Button, Drawer } from "~/components/design-system";
import { PetCardRecord } from "~/components/Pet/PetCardRecord";

const PLAYGROUND_RECORD_OPTIONS: ComponentProps<
  typeof PetCardRecord
>["record"][] = [
  {
    downloadPath:
      "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg",
    fileName: "Dog image",
    fileType: "jpg",
  },
  {
    downloadPath:
      "https://training.github.com/downloads/pt_BR/github-git-cheat-sheet.pdf",
    fileName: "PDF gitHub",
    fileType: "pdf",
  },
];

export const PetCardRecordPlayground = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open drawer to pet record component
      </Button>
      <Drawer
        ariaLabel="pet card record on playground"
        id="petCardRecordPlayground"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="grid gap-small">
          {PLAYGROUND_RECORD_OPTIONS.map(
            ({ downloadPath, fileName, fileType }) => (
              <PetCardRecord
                record={{
                  downloadPath,
                  fileName,
                  fileType,
                }}
              />
            )
          )}

          <Button
            className="my-xxxlarge"
            onClick={() => setIsUploading((prev) => !prev)}
          >
            Upload
          </Button>
          {isUploading && (
            <PetCardRecord
              record={{
                fileName: "Upload test",
              }}
              isUploadingFile={isUploading}
            />
          )}
        </div>
      </Drawer>
    </div>
  );
};
