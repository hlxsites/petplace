import { Drawer } from "~/components/design-system";
import { PetDocumentsView } from "~/components/Pet/PetDocumentsView";
import { useDocumentTypeIndexViewModel } from "./useDocumentTypeIndexViewModel";

export const DocumentTypeIndex = () => {
  const {
    documents,
    documentType: { id, label },
    onClose,
    onDelete,
  } = useDocumentTypeIndexViewModel();

  return (
    <Drawer
      id={id}
      isOpen
      titleLevel="h4"
      onClose={onClose}
      title={label}
      width="fit-content"
    >
      <PetDocumentsView
        documents={documents}
        onDelete={onDelete}
        recordType={id}
      />
    </Drawer>
  );
};
