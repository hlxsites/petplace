import { ComponentProps } from "react";
import { PetDocumentsView } from "~/components/Pet/PetDocumentsView";

export const PetDocumentsViewPlayground = () => {
  return (
    <div className="w-[400px]">
      <PetDocumentsView
        documents={renderDocuments()}
        onDelete={onDelete}
        recordType="medical"
      />
    </div>
  );

  function onDelete() {
    return;
  }

  function renderDocuments() {
    return [
      {
        fileName: "Test record doc",
        fileType: "doc",
      },
      {
        fileName: "Test record docx",
        fileType: "docx",
      },
      {
        fileName: "Test record jpg",
        fileType: "jpg",
      },
      {
        fileName: "Test record pdf",
        fileType: "pdf",
      },
      {
        fileName: "Test record txt",
        fileType: "txt",
      },
      {
        fileName: "Test record png",
        fileType: "png",
      },
    ] as ComponentProps<typeof PetDocumentsView>["documents"];
  }
};
