import { Drawer } from "~/components/design-system";
import { PetDocumentsView } from "~/components/Pet/PetDocumentsView";
import { useDocumentTypeIndexViewModel } from "./useDocumentTypeIndexViewModel";
import { SuspenseAwait } from "~/components/await/SuspenseAwait";

export const DocumentTypeIndex = () => {
  const {
    documents,
    documentType: { id, name },
    onClose,
    onDelete,
    onDownload,
  } = useDocumentTypeIndexViewModel();

  return (
    <Drawer id={id} isOpen onClose={onClose} title={name} width="fit-content">
      <SuspenseAwait resolve={documents}>
        {(resolvedDocuments) => (
          <PetDocumentsView
            documents={resolvedDocuments}
            onDelete={onDelete}
            onDownload={() => onDownload}
            recordType={id}
          />
        )}
      </SuspenseAwait>
    </Drawer>
  );
};
