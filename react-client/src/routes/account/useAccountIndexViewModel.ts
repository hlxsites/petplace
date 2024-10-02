import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { requireAuthToken } from "~/util/authUtil";

import { isEqual } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormValues } from "~/components/design-system";
import {
  OnChangeFn,
  OnSubmitFn,
} from "~/components/design-system/form/FormBuilder";
import { CountryModel } from "~/domain/models/lockup/CountryModel";
import { CountryStateModel } from "~/domain/models/lockup/CountryStateModel";
import {
  AccountDetailsModel,
  AccountEmergencyContactModel,
  ExternalAccountDetailsModel,
  InternalAccountDetailsModel,
} from "~/domain/models/user/UserModels";
import getCountriesUseCaseFactory from "~/domain/useCases/lookup/getCountriesUseCaseFactory";
import getStatesUseCaseFactory from "~/domain/useCases/lookup/getStatesUseCaseFactory";
import accountDetailsUseCaseFactory from "~/domain/useCases/user/accountDetailsUseCaseFactory";
import accountEmergencyContactsUseCaseFactory from "~/domain/useCases/user/accountEmergencyContactsUseCaseFactory";
import { useRouteMatchesData } from "~/domain/useRouteMatchesData";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";
import { logError } from "~/infrastructure/telemetry/logUtils";
import {
  accountAddressIds,
  accountAgreementsIds,
  baseAccountDetailsIds,
  emergencyContactIds,
} from "./form/accountForms";
import { AccountRootLoaderData } from "./useAccountRootViewModel";

export const loader = (() => {
  const authToken = requireAuthToken();

  const accountDetailsUseCase = accountDetailsUseCaseFactory(authToken);

  const accountEmergencyContactsUseCase =
    accountEmergencyContactsUseCaseFactory(authToken);

  const getCountriesUseCase = getCountriesUseCaseFactory();
  const getStatesUseCase = getStatesUseCaseFactory(authToken);

  return defer({
    accountDetailsQuery: accountDetailsUseCase.query(),
    deleteEmergencyContactMutation: accountEmergencyContactsUseCase.delete,
    emergencyContactsQuery: accountEmergencyContactsUseCase.query(),
    countries: getCountriesUseCase.query(),
    mutateAccountDetails: accountDetailsUseCase.mutate,
    submitEmergencyContactsMutation: accountEmergencyContactsUseCase.mutate,
    statesQuery: getStatesUseCase.query,
  });
}) satisfies LoaderFunction;

export const useAccountIndexViewModel = () => {
  const {
    accountDetailsQuery,
    deleteEmergencyContactMutation,
    emergencyContactsQuery,
    countries,
    mutateAccountDetails,
    submitEmergencyContactsMutation,
    statesQuery,
  } = useLoaderData<typeof loader>();
  const accountRootData = useRouteMatchesData<AccountRootLoaderData>("account");

  // TODO: split this view model into smaller parts

  const [countryStateList, setCountryStateList] = useState<CountryStateModel[]>(
    []
  );

  const initialAccountFormValuesRef = useRef<FormValues>({});
  const originalEmergencyContactsRef = useRef<AccountEmergencyContactModel[]>(
    []
  );
  const initialEmergencyContactsFormValue =
    getEmergencyContactsInitialFormValue(originalEmergencyContactsRef.current);

  const [accountFormValues, setAccountFormValues] = useState<FormValues>({});
  const [emergencyContactsFormValues, setEmergencyContactsFormValues] =
    useState<FormValues>({});
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isLoadingEmergencyContacts, setIsLoadingEmergencyContacts] =
    useState(true);
  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false);
  const [isSubmittingEmergencyContacts, setIsSubmittingEmergencyContacts] =
    useState(false);

  const isExternalLogin = !!accountRootData?.isExternalLogin;

  const countryOptions = countries.map((country) => country.title);
  const selectedCountry = countries.find(
    (country) => country.title === accountFormValues.country
  );

  const stateOptions = countryStateList.map((state) => state.title);

  const isDirtyAccountForm = !isEqual(
    accountFormValues,
    initialAccountFormValuesRef.current
  );
  const isDirtyEmergencyContactsForm = !isEqual(
    emergencyContactsFormValues,
    initialEmergencyContactsFormValue
  );

  const fetchAccountForm = useCallback(async () => {
    const response = await accountDetailsQuery;

    const initialValues = getAccountDetailsInitialFormValue(
      response,
      isExternalLogin
    );

    // Set the country
    const countryTitle = countries.find(
      ({ id }) => id === initialValues.country
    );
    initialValues.country = countryTitle?.title ?? "";

    // Set the state
    if (countryTitle && initialValues.state) {
      const statesList = await statesQuery(countryTitle.id);
      setCountryStateList(statesList);

      const stateTitle = statesList.find(
        ({ id }) => id === initialValues.state
      );
      initialValues.state = stateTitle?.title ?? "";
    }

    console.log("initialValues", initialValues);
    initialAccountFormValuesRef.current = { ...initialValues };

    setAccountFormValues(initialValues);
    setIsLoadingAccount(false);
  }, [accountDetailsQuery, countries, isExternalLogin, statesQuery]);

  useDeepCompareEffect(() => {
    void fetchAccountForm();
  }, [fetchAccountForm, selectedCountry]);

  const fetchEmergencyContacts = useCallback(async () => {
    const list = await emergencyContactsQuery;
    originalEmergencyContactsRef.current = list;

    setEmergencyContactsFormValues(getEmergencyContactsInitialFormValue(list));
    setIsLoadingEmergencyContacts(false);
  }, [emergencyContactsQuery]);

  useDeepCompareEffect(() => {
    void fetchEmergencyContacts();
  }, [fetchEmergencyContacts]);

  useEffect(() => {
    const fetchStatesForCountry = async (countryId: string) => {
      const statesList = await statesQuery(countryId);
      setCountryStateList(statesList);
    };

    if (selectedCountry?.id) {
      void fetchStatesForCountry(selectedCountry.id);
    }
  }, [selectedCountry?.id, statesQuery]);

  const onChangesAccountFormValues: OnChangeFn = (values) => {
    setAccountFormValues(values);
  };

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

  const asyncSubmitAccountDetails = async (values: FormValues) => {
    setIsSubmittingAccount(true);

    const accountDetails = convertFormValuesToAccountDetails(
      values,
      isExternalLogin,
      countries,
      countryStateList
    );

    if (accountDetails && validateAccountDetails(accountDetails)) {
      const response = await mutateAccountDetails(accountDetails);
      if (response) {
        // Update the form values with the new data
        initialAccountFormValuesRef.current = values;
      }
    }

    setIsSubmittingAccount(false);
  };

  const onSubmitAccountDetails: OnSubmitFn = ({ values }) => {
    void asyncSubmitAccountDetails(values);
  };

  return {
    accountFormValues,
    emergencyContactsFormValues,
    isDirty: {
      account: isDirtyAccountForm,
      emergencyContacts: isDirtyEmergencyContactsForm,
    },
    isExternalLogin,
    isLoading: {
      account: isLoadingAccount,
      emergencyContacts: isLoadingEmergencyContacts,
    },
    isSubmitting: {
      account: isSubmittingAccount,
      emergencyContacts: isSubmittingEmergencyContacts,
    },
    onChangesAccountFormValues,
    onChangesEmergencyContactsFormValues,
    onSubmitEmergencyContacts,
    onSubmitAccountDetails,
    accountDetailsFormVariables: {
      countryOptions,
      stateOptions,
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

function getAccountDetailsInitialFormValue(
  accountDetails: AccountDetailsModel | null,
  isExternalLogin: boolean
): FormValues {
  if (!accountDetails) return {};
  if (!isExternalLogin) return getInternalAccountDetailsData(accountDetails);

  return getExternalAccountDetailsData(
    accountDetails as ExternalAccountDetailsModel
  );
}

function getInternalAccountDetailsData(
  accountDetails: InternalAccountDetailsModel
) {
  return {
    [baseAccountDetailsIds.name]: accountDetails.name ?? "",
    [baseAccountDetailsIds.surname]: accountDetails.surname ?? "",
    [baseAccountDetailsIds.email]: accountDetails.email ?? "",
    [baseAccountDetailsIds.phone]: accountDetails.defaultPhone ?? "",
  } satisfies FormValues;
}

function getExternalAccountDetailsData(
  accountDetails: ExternalAccountDetailsModel
) {
  return {
    ...getInternalAccountDetailsData(accountDetails),
    [baseAccountDetailsIds.secondaryPhone]: accountDetails.secondaryPhone ?? "",
    [accountAddressIds.country]: accountDetails.address.country,
    [accountAddressIds.state]: accountDetails.address.state,
    [accountAddressIds.city]: accountDetails.address.city,
    [accountAddressIds.zipCode]: accountDetails.address.zipCode,
    [accountAddressIds.address1]: accountDetails.address.address1,
    [accountAddressIds.address2]: accountDetails.address.address2,
    [accountAgreementsIds.contactConsent]: !accountDetails.contactConsent
      ? []
      : [
          `In the event that your pet is missing and is found by a Good Samaritan, you give your consent for us to release your contact information to the finder. This may include your name, phone number, address and email address.`,
        ],
    [accountAgreementsIds.informationConsent]:
      !accountDetails.informationConsent
        ? []
        : [
            `With your 24Pet® microchip, Pethealth Services (USA) Inc. ("PSU") may offer you free lost pet services, as well as exclusive offers, promotions and the latest information from 24Pet regarding microchip services. Additionally, PSU's affiliates, including PTZ Insurance Agency, Ltd., PetPartners, Inc. and Independence Pet Group, Inc., and their subsidiaries (collectively, "PTZ") may offer you promotions and the latest information regarding pet insurance services and products. PSU may also have or benefit from contractual arrangements with third parties ("Partners") who may offer you related services, products, offers and/or promotions.By giving consent, you agree that PSU, its Partners and/or PTZ may contact you for the purposes identified herein via commercial electronic messages at the e-mail address you provided, via mailer at the mailing address you provided and/or via automatic telephone dialing systems, pre-recorded/automated messages and/or text messages at the telephone number(s) you provided. Data and message rates may apply. This consent is not a condition of the purchase of any goods or services. You understand that if you choose not to provide your consent, you will not receive the above-mentioned communications or free lost pet services, which includes being contacted with information in the event that your pet goes missing.You may withdraw your consent at any time.`,
          ],
  } satisfies FormValues;
}

function validateAccountDetails(accountDetails: AccountDetailsModel) {
  return (
    validateNameOrSurname(accountDetails.name) &&
    validateNameOrSurname(accountDetails.surname)
  );
}

function validateNameOrSurname(value: string) {
  const pattern = /^[A-Za-z'-\s]+$/;
  return pattern.test(value);
}

function convertFormValuesToAccountDetails(
  values: FormValues,
  isExternalLogin: boolean,
  countriesList: CountryModel[],
  statesList: CountryStateModel[]
): AccountDetailsModel | null {
  const accountDetails: AccountDetailsModel = {
    email: values[baseAccountDetailsIds.email] as string,
    name: values[baseAccountDetailsIds.name] as string,
    defaultPhone: values[baseAccountDetailsIds.phone] as string,
    surname: values[baseAccountDetailsIds.surname] as string,
  };

  if (!isExternalLogin) return accountDetails;

  const country = (() => {
    const c = values[accountAddressIds.country] as string;
    return countriesList.find(({ title }) => title === c)?.id;
  })();

  const state = (() => {
    const s = values[accountAddressIds.state] as string;
    return statesList.find(({ title }) => title === s)?.id;
  })();

  if (!country || !state) {
    logError("Country or state not found while saving the form", {
      country,
      state,
    });
    return null;
  }

  return {
    ...accountDetails,
    address: {
      address1: values[accountAddressIds.address1] as string,
      address2: values[accountAddressIds.address2] as string,
      city: values[accountAddressIds.city] as string,
      country,
      state,
      zipCode: values[accountAddressIds.zipCode] as string,
    },
    contactConsent: !!(values[accountAgreementsIds.contactConsent] as string[])
      .length,
    informationConsent: !!(
      values[accountAgreementsIds.informationConsent] as string[]
    ).length,
    secondaryPhone: values[baseAccountDetailsIds.secondaryPhone] as string,
  };
}
