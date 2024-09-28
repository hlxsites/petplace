import {
  ElementButton,
  ElementInputPhone,
  ElementInputSingleSelect,
  ElementInputText,
  ElementSection,
  ElementUnion,
  FormSchema,
} from "~/components/design-system";

export const baseAccountDetailsIds = {
  email: "email-address",
  name: "first-name",
  phone: "phone-default",
  secondaryPhone: "phone-secondary",
  surname: "last-name",
  zipCode: "zip-code",
};

const requiredPhoneInput: ElementInputPhone = {
  defaultType: "Home",
  disabledType: true,
  description:
    "You’re not required to own a ‘Home’ phone, however if it’s left blank, our system will auto-populate this field with your mobile or work number. This will not impact our ability to contact you if your pet is lost and found",
  elementType: "input",
  errorMessage: "Please fill out your phone number before continuing.",
  id: baseAccountDetailsIds.phone,
  label: "Phone Number",
  requiredCondition: {
    inputId: "phone-secondary",
    type: "null",
    value: "",
  },
  type: "phone",
};

const optionalPhoneInput: ElementInputPhone = {
  elementType: "input",
  id: baseAccountDetailsIds.secondaryPhone,
  label: "Phone Number 2",
  type: "phone",
};

const firstNameInput: ElementInputText = {
  elementType: "input",
  errorMessage: "First Name is a required field",
  id: baseAccountDetailsIds.name,
  label: "First Name",
  maxLength: 100,
  minLength: 2,
  requiredCondition: true,
  type: "text",
};

const lastNameInput: ElementInputText = {
  elementType: "input",
  errorMessage: "Last Name is a required field",
  id: baseAccountDetailsIds.surname,
  label: "Last Name",
  maxLength: 100,
  minLength: 2,
  requiredCondition: true,
  type: "text",
};

const emailInput: ElementInputText = {
  elementType: "input",
  errorMessage: "Email is a required field",
  id: baseAccountDetailsIds.email,
  label: "Email Address",
  requiredCondition: true,
  disabledCondition: true,
  type: "email",
};

const countryInput: ElementInputSingleSelect = {
  elementType: "input",
  id: "country",
  label: "Country",
  options: "{{countryOptions|string[]}}",
  optionsType: "dynamic",
  requiredCondition: true,
  type: "select",
};

const stateInput: ElementInputSingleSelect = {
  elementType: "input",
  id: "state",
  label: "Province/State",
  options: "{{stateOptions|string[]}}",
  optionsType: "dynamic",
  requiredCondition: true,
  disabledCondition: {
    inputId: "country",
    type: "null",
    value: "",
  },
  placeholder: "State",
  type: "select",
};

const addressLineOneInput: ElementInputText = {
  elementType: "input",
  id: "address-1",
  label: "Address Line 1",
  requiredCondition: true,
  type: "text",
};

const addressLineTwoInput: ElementInputText = {
  elementType: "input",
  id: "address-2",
  label: "Address Line 2",
  requiredCondition: true,
  type: "text",
};

const cityInput: ElementInputText = {
  elementType: "input",
  id: "city",
  label: "City",
  requiredCondition: true,
  type: "text",
};

const zipCodeInput: ElementInputText = {
  className: "w-1/2",
  elementType: "input",
  id: baseAccountDetailsIds.zipCode,
  label: "Zip Code",
  maxLength: 15,
  requiredCondition: true,
  type: "text",
};

const submitButton: ElementButton = {
  className: "!mt-xxlarge w-full",
  elementType: "button",
  enabledCondition: true,
  id: "submit-button",
  label: "Save changes",
  type: "submit",
};

const contactInfoSection = (children: ElementUnion[]): ElementSection => ({
  elementType: "section",
  title: {
    label: "Contact Info",
    size: "24",
  },
  className: "!mb-xxxlarge",
  children: [
    {
      elementType: "row",
      children,
    },
  ],
});

const userDetailsSection = (children: ElementUnion[]): ElementSection => ({
  elementType: "section",
  title: {
    label: "User details",
    level: "h3",
  },
  children: [
    {
      elementType: "row",
      children: [firstNameInput, lastNameInput],
    },
    {
      elementType: "row",
      children,
    },
  ],
});

export const internalAccountDetailsFormSchema: FormSchema = {
  id: "account-details-form",
  children: [
    contactInfoSection([{ ...requiredPhoneInput, className: "w-1/2" }]),
    userDetailsSection([emailInput, { ...zipCodeInput, className: "" }]),
    submitButton,
  ],
  version: 0,
};

export const externalAccountDetailsFormSchema: FormSchema = {
  id: "account-details-form",
  children: [
    contactInfoSection([requiredPhoneInput, optionalPhoneInput]),
    userDetailsSection([emailInput]),
    {
      elementType: "section",
      title: {
        label: "Address",
        level: "h3",
      },
      children: [
        {
          elementType: "row",
          children: [countryInput, stateInput],
        },
        {
          elementType: "row",
          children: [addressLineOneInput, addressLineTwoInput],
        },
        {
          elementType: "row",
          children: [cityInput, zipCodeInput],
        },
      ],
    },
    {
      elementType: "section",
      description: {
        label:
          "You understand and consent to the collection, storage and use of your personal data for the purposes outlined in the 24Petwatch Privacy Policy. Your personal data privacy rights are outlined therein.",
        size: "16",
      },
      title: {
        label: "User Agreements",
        size: "24",
      },
      children: [
        {
          elementType: "input",
          hideLabel: true,
          id: "pet-health-services",
          label: "Consent to terms of service",
          options: [
            `With your 24Pet® microchip, Pethealth Services (USA) Inc. ("PSU") may offer you free lost pet services, as well as exclusive offers, promotions and the latest information from 24Pet regarding microchip services. Additionally, PSU's affiliates, including PTZ Insurance Agency, Ltd., PetPartners, Inc. and Independence Pet Group, Inc., and their subsidiaries (collectively, "PTZ") may offer you promotions and the latest information regarding pet insurance services and products. PSU may also have or benefit from contractual arrangements with third parties ("Partners") who may offer you related services, products, offers and/or promotions.By giving consent, you agree that PSU, its Partners and/or PTZ may contact you for the purposes identified herein via commercial electronic messages at the e-mail address you provided, via mailer at the mailing address you provided and/or via automatic telephone dialing systems, pre-recorded/automated messages and/or text messages at the telephone number(s) you provided. Data and message rates may apply. This consent is not a condition of the purchase of any goods or services. You understand that if you choose not to provide your consent, you will not receive the above-mentioned communications or free lost pet services, which includes being contacted with information in the event that your pet goes missing.You may withdraw your consent at any time.`,
          ],
          type: "checkboxGroup",
        },
        {
          elementType: "input",
          hideLabel: true,
          id: "contact-availability",
          label: "Consent to release information",
          options: [
            `In the event that your pet is missing and is found by a Good Samaritan, you give your consent for us to release your contact information to the finder. This may include your name, phone number, address and email address.`,
          ],
          type: "checkboxGroup",
        },
      ],
    },
    submitButton,
  ],
  version: 0,
};

export const emergencyContactFormSchema: FormSchema = {
  id: "emergency-contact-form",
  children: [
    {
      elementType: "section",
      title: {
        label: "Emergency contact info",
        size: "24",
      },
      children: [
        {
          elementType: "repeater",
          id: "emergency-contact",
          maxRepeat: 2,
          minRepeat: 1,
          labels: {
            add: "Add emergency contact",
            remove: "Remove emergency contact",
          },
          children: [
            {
              elementType: "section",
              title: {
                label: "Emergency contact {{index}}",
                level: "h3",
              },
              children: [
                {
                  elementType: "row",
                  children: [
                    {
                      ...firstNameInput,
                      id: "contact-first-name",
                    },
                    {
                      ...lastNameInput,
                      id: "contact-last-name",
                    },
                  ],
                },
                {
                  elementType: "row",
                  children: [
                    {
                      ...emailInput,
                      id: "contact-email-address",
                      disabledCondition: false,
                    },
                    {
                      elementType: "input",
                      errorMessage: "Phone Number is a required field",
                      hideType: true,
                      id: "contact-phone",
                      label: "Phone Number",
                      requiredCondition: true,
                      type: "phone",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    submitButton,
  ],
  version: 0,
};
