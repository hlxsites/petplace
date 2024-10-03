import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Drawer } from "~/components/design-system";
import { PetDocumentsView } from "./components/PetDocumentsView";
import { useDocumentTypeIndexViewModel } from "./useDocumentTypeIndexViewModel";

export const DocumentTypeIndex = () => {
  const {
    clearDownloadError,
    documents,
    documentType: { id, label },
    downloadError,
    onClose,
    onDelete,
    onDownload,
    onUpload,
    uploadingNamesList,
  } = useDocumentTypeIndexViewModel();

  return (
    <Drawer id={id} isOpen onClose={onClose} title={label} trigger={undefined}>
      <SuspenseAwait minHeight={100} resolve={documents}>
        {(resolvedDocuments) => (
          <PetDocumentsView
            clearDownloadError={clearDownloadError}
            documents={resolvedDocuments}
            documentType={id}
            downloadError={downloadError}
            onDelete={onDelete}
            onDownload={onDownload}
            onUpload={onUpload}
            uploadingNamesList={uploadingNamesList}
          />
        )}
      </SuspenseAwait>
    </Drawer>
  );
};
