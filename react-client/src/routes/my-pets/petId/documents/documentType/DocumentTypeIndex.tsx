import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Drawer } from "~/components/design-system";
import { PetDocumentsView } from "~/components/Pet/PetDocumentsView";
import { useDocumentTypeIndexViewModel } from "./useDocumentTypeIndexViewModel";

export const DocumentTypeIndex = () => {
  const {
    documents,
    documentType: { id, label },
    onClose,
    onDelete,
    onDownload,
  } = useDocumentTypeIndexViewModel();

  return (
    <Drawer id={id} isOpen onClose={onClose} title={label} width="fit-content">
      <SuspenseAwait resolve={documents}>
        {(resolvedDocuments) => (
          <PetDocumentsView
            documents={resolvedDocuments}
            documentType={id}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        )}
      </SuspenseAwait>
    </Drawer>
  );
};
