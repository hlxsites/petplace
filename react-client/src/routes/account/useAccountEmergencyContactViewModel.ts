import { isEqual } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormValues } from "~/components/design-system";
import {
  OnChangeFn,
  OnSubmitFn,
} from "~/components/design-system/form/FormBuilder";
import { AccountEmergencyContactModel } from "~/domain/models/user/UserModels";
import {
  emergencyContactFormSchema,
  emergencyContactIds,
} from "./form/accountForms";

type UseAccountEmergencyContactViewModelProps = {
  deleteEmergencyContactMutation: (
    data: AccountEmergencyContactModel
  ) => Promise<boolean>;
  emergencyContactsQuery: () => Promise<AccountEmergencyContactModel[]>;
  isSsoEnabledLogin: boolean;
  submitEmergencyContactsMutation: (
    data: AccountEmergencyContactModel[]
  ) => Promise<boolean>;
};

export const useAccountEmergencyContactViewModel = ({
  deleteEmergencyContactMutation,
  emergencyContactsQuery,
  isSsoEnabledLogin,
  submitEmergencyContactsMutation,
}: UseAccountEmergencyContactViewModelProps) => {
  const originalEmergencyContactsRef = useRef<AccountEmergencyContactModel[]>(
    []
  );
  const initialEmergencyContactsFormValue =
    getEmergencyContactsInitialFormValue(originalEmergencyContactsRef.current);

  const [emergencyContactsFormValues, setEmergencyContactsFormValues] =
    useState<FormValues>({});
  const [isLoadingEmergencyContacts, setIsLoadingEmergencyContacts] =
    useState(false);
  const [isSubmittingEmergencyContacts, setIsSubmittingEmergencyContacts] =
    useState(false);

  const isDirtyEmergencyContactsForm = !isEqual(
    emergencyContactsFormValues,
    initialEmergencyContactsFormValue
  );

  const fetchEmergencyContacts = useCallback(async () => {
    // If SSO is not enabled, do not fetch emergency contacts
    if (!isSsoEnabledLogin) return;
    setIsLoadingEmergencyContacts(true);

    const list = await emergencyContactsQuery();
    originalEmergencyContactsRef.current = list;

    setEmergencyContactsFormValues(getEmergencyContactsInitialFormValue(list));
    setIsLoadingEmergencyContacts(false);
  }, [emergencyContactsQuery, isSsoEnabledLogin]);

  useEffect(() => {
    void fetchEmergencyContacts();
  }, [fetchEmergencyContacts]);

  const onChangesEmergencyContactsFormValues: OnChangeFn = (values) => {
    setEmergencyContactsFormValues(values);
  };

  const onDeleteEmergencyContact = async (
    data: AccountEmergencyContactModel
  ) => {
    return deleteEmergencyContactMutation(data);
  };

  const asyncSubmitEmergencyContacts = async (
    data: AccountEmergencyContactModel[]
  ) => {
    setIsSubmittingEmergencyContacts(true);

    // First, delete all existing contacts
    const deletePromisesList = originalEmergencyContactsRef.current.map(
      (contact) => onDeleteEmergencyContact(contact)
    );
    await Promise.all(deletePromisesList);

    // Then, submit the new list if there are any contacts
    if (data.length) {
      await submitEmergencyContactsMutation(data);
    }

    // Finally, fetch the new list
    await fetchEmergencyContacts();

    setIsSubmittingEmergencyContacts(false);
  };

  const onSubmitEmergencyContacts: OnSubmitFn = ({ values }) => {
    const data = buildAccountEmergencyContactsList(
      values[emergencyContactIds.repeaterId] as unknown as FormValues[]
    );

    void asyncSubmitEmergencyContacts(data);
  };

  return {
    isDirty: isDirtyEmergencyContactsForm,
    isLoading: isLoadingEmergencyContacts,
    isSubmitting: isSubmittingEmergencyContacts,
    onChange: onChangesEmergencyContactsFormValues,
    onSubmit: onSubmitEmergencyContacts,
    schema: emergencyContactFormSchema,
    values: emergencyContactsFormValues,
  };
};

function buildAccountEmergencyContactsList(
  values: FormValues[]
): AccountEmergencyContactModel[] {
  const cleanupPhone = (phoneString: string) => {
    const [phone] = phoneString.split("|");
    return phone.replace(/[^0-9]/g, "");
  };

  return values.map((contact) => ({
    contactId: contact[emergencyContactIds.contactId] as string,
    email: contact[emergencyContactIds.email] as string,
    name: contact[emergencyContactIds.name] as string,
    phoneNumber: cleanupPhone(contact[emergencyContactIds.phone] as string),
    surname: contact[emergencyContactIds.surname] as string,
    stagingId: contact[emergencyContactIds.stagingId] as number,
  }));
}

function getEmergencyContactsInitialFormValue(
  emergencyContacts?: AccountEmergencyContactModel[] | null
) {
  const contacts: FormValues[] = [];
  emergencyContacts?.forEach((contact) =>
    contacts.push({
      [emergencyContactIds.name]: contact.name,
      [emergencyContactIds.surname]: contact.surname,
      [emergencyContactIds.email]: contact.email,
      [emergencyContactIds.phone]: contact.phoneNumber,
    })
  );

  return { [emergencyContactIds.repeaterId]: contacts };
}
