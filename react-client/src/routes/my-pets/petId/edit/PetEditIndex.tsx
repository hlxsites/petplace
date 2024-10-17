import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import { Header } from "~/components/design-system/header/Header";
import { PetModel } from "~/domain/models/pet/PetModel";
import { PET_PROFILE_FULL_ROUTE } from "~/routes/AppRoutePaths";
import { invariant } from "~/util/invariant";
import { DiscardConfirmationModal } from "./components/DiscardConfirmationModal";
import { FormSection } from "./components/FormSection";
import { usePetEditViewModel } from "./usePetEditViewModel";

export const PetEditIndex = () => {
  const { form, handleClose, onDiscard, petInfoQuery, ...formUtility } =
    usePetEditViewModel();

  return <SuspenseAwait resolve={petInfoQuery}>{renderMain}</SuspenseAwait>;

  function renderMain(pet: PetModel | null) {
    invariant(pet, "Pet not found");

    const { isDiscarding, ...rest } = form;

    return (
      <>
        <Header
          backButtonTo={PET_PROFILE_FULL_ROUTE(pet.id)}
          pageTitle="Edit Pet Profile"
        />
        <FormSection pet={pet} form={rest} {...formUtility} />
        {isDiscarding && (
          <DiscardConfirmationModal
            onClose={handleClose}
            onConfirm={onDiscard}
          />
        )}
      </>
    );
  }
};
