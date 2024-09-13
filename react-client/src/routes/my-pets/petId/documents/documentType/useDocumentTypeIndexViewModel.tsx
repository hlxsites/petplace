import { useNavigate } from "react-router-dom";
import { LoaderFunction, useLoaderData } from "react-router-typesafe";

import { isValidPetDocumentId } from "~/domain/models/pet/PetDocument";
import { GetPetDocumentsUseCase } from "~/domain/useCases/pet/GetPetDocumentsUseCase";
import { requireAuthToken } from "~/util/authUtil";
import { invariant, invariantResponse } from "~/util/invariant";
import { usePetProfileContext } from "../../usePetProfileLayoutViewModel";

export const loader = (async ({ params }) => {
  const { petId, documentType } = params;
  invariantResponse(petId, "Pet id is required in this route");
  invariantResponse(
    isValidPetDocumentId(documentType),
    "Invalid document type"
  );

  const authToken = requireAuthToken();
  const useCase = new GetPetDocumentsUseCase(authToken);

  const documents = await useCase.query(petId, documentType);

  return {
    id: documentType,
    petId,
    documents,
  };
}) satisfies LoaderFunction;

export const useDocumentTypeIndexViewModel = () => {
  const { id, documents } = useLoaderData<typeof loader>();
  const { documentTypes } = usePetProfileContext();
  const navigate = useNavigate();

  const documentType = documentTypes.find((dt) => dt.id === id);
  invariant(documentType, "Document type must be found here");

  const onClose = () => {
    navigate("..");
  };

  const onDelete = (recordId: string) => {
    // TODO: Implement real delete action when backend is ready
    console.log("recordId", recordId);
  };

  return {
    documents,
    documentType,
    onClose,
    onDelete,
  };
};
