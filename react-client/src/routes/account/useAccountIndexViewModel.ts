import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import { isEqual } from "lodash";
import { useCallback, useRef, useState } from "react";
import { FormValues } from "~/components/design-system";
import {
  OnChangeFn,
  OnSubmitFn,
} from "~/components/design-system/form/FormBuilder";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
} from "~/domain/models/user/UserModels";
import getCountriesUseCaseFactory from "~/domain/useCases/lookup/getCountriesUseCaseFactory";
import getStatesUseCaseFactory from "~/domain/useCases/lookup/getStatesUseCaseFactory";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountEmergencyContactsUseCaseFactory from "~/domain/useCases/user/accountEmergencyContactsUseCaseFactory";
import { useRouteMatchesData } from "~/domain/useRouteMatchesData";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { emergencyContactIds } from "./form/accountForms";
import { AccountRootLoaderData } from "./useAccountRootViewModel";
import {
  buildAccountDetails,
  validateAccountDetails,
} from "./util/formDataUtil";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);

  const accountEmergencyContactsUseCase =
    accountEmergencyContactsUseCaseFactory(authToken);

  const getCountriesUseCase = getCountriesUseCaseFactory();
  const getStatesUseCase = getStatesUseCaseFactory(authToken);

  return defer({
    accountDetails: accountDetailsUseCase.query(),
    deleteEmergencyContactMutation: accountEmergencyContactsUseCase.delete,
    emergencyContactsQuery: accountEmergencyContactsUseCase.query(),
    countries: getCountriesUseCase.query(),
    getStates: getStatesUseCase.query,
    mutateAccountDetails: accountDetailsUseCase.mutate,
    submitEmergencyContactsMutation: accountEmergencyContactsUseCase.mutate,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetails,
    deleteEmergencyContactMutation,
    emergencyContactsQuery,
    countries,
    mutateAccountDetails,
    submitEmergencyContactsMutation,
  } = useLoaderData<typeof loader>();
  const accountRootData = useRouteMatchesData<AccountRootLoaderData>("account");

  // TODO implement dynamic state call based in country selector
  const [stateVariables] = useState([]);

  const originalEmergencyContactsRef = useRef<AccountEmergencyContactModel[]>(
    []
  );
  const initialEmergencyContactsFormValue =
    getEmergencyContactsInitialFormValue(originalEmergencyContactsRef.current);

  const [emergencyContactsFormValues, setEmergencyContactsFormValues] =
    useState<FormValues>({});
  const [isLoadingEmergencyContacts, setIsLoadingEmergencyContacts] =
    useState(true);
  const [isSubmittingEmergencyContacts, setIsSubmittingEmergencyContacts] =
    useState(false);

  const isExternalLogin = !!accountRootData?.isExternalLogin;

  const countryOptions = countries.map((country) => country.title);

  const isDirtyEmergencyContactsForm = !isEqual(
    emergencyContactsFormValues,
    initialEmergencyContactsFormValue
  );

  const fetchEmergencyContacts = useCallback(async () => {
    const list = await emergencyContactsQuery;
    originalEmergencyContactsRef.current = list;

    setEmergencyContactsFormValues(getEmergencyContactsInitialFormValue(list));
    setIsLoadingEmergencyContacts(false);
  }, [emergencyContactsQuery]);

  useDeepCompareEffect(() => {
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

    // Then, submit the new list
    await submitEmergencyContactsMutation(data);

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

  const onSubmitAccountDetails: OnSubmitFn = ({ values }) => {
    const accountDetails: AccountDetailsModel = buildAccountDetails(values);

    if (validateAccountDetails(accountDetails)) {
      void mutateAccountDetails(accountDetails);
    }
  };

  return {
    accountDetails,
    emergencyContactsFormValues,
    isDirty: {
      emergencyContacts: isDirtyEmergencyContactsForm,
    },
    isExternalLogin,
    isLoading: {
      emergencyContacts: isLoadingEmergencyContacts,
    },
    isSubmitting: {
      emergencyContacts: isSubmittingEmergencyContacts,
    },
    onChangesEmergencyContactsFormValues,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
    accountDetailsFormVariables: {
      countryOptions,
      stateOptions: stateVariables,
    },
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
