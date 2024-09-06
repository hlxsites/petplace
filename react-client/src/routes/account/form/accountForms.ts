import { FormSchema } from "~/components/design-system";

const requiredPhoneInput = {
  defaultSelect: "Home",
  disableSelect: true,
  description:
    "You’re not required to own a ‘Home’ phone, however if it’s left blank, our system will auto-populate this field with your mobile or work number. This will not impact our ability to contact you if your pet is lost and found",

  id: "contact-default",
  label: "Phone Number (Required)",
  requiredCondition: true,
};

const optionalPhoneInput = {
  id: "contact-2",
  label: "Phone Number 2",
};

const firstNameInput = {
  id: "first-name",
  label: "First Name",
  requiredCondition: true,
};

const lastNameInput = {
  id: "last-name",
  label: "Last Name",
  requiredCondition: true,
};

const emailInput = {
  id: "email-address",
  label: "Email Address",
  requiredCondition: true,
};

const countryInput = {
  id: "country",
  label: "Country",
  requiredCondition: true,
};

const stateInput = {
  id: "state",
  label: "Province/State",
  requiredCondition: true,
  placeholder: "State",
};

const addressLineOneInput = {
  id: "address-1",
  label: "Address Line 1",
  requiredCondition: true,
};

const addressLineTwoInput = {
  id: "address-2",
  label: "Address Line 2",
  requiredCondition: true,
};

const cityInput = {
  id: "city",
  label: "City",
  requiredCondition: true,
};

const intersectionInput = {
  id: "intersection-address",
  label: "Intersection/Address",
  requiredCondition: true,
};

const zipCodeInput = {
  id: "zip-code",
  label: "Zip Code",
  requiredCondition: true,
};

const submit = {
  disabledCondition: true,
  id: "submit-button",
  label: "Save changes",
};

export const internalAccountDetailsFormSchema: FormSchema = {
  id: "account-details-form",
  children: [
    {
      elementType: "section",
      title: "Contact Info",
      className: "!mb-xxxlarge",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "contact",
              ...requiredPhoneInput,
            },
            {
              elementType: "input",
              type: "contact",
              ...optionalPhoneInput,
            },
          ],
        },
      ],
    },
    {
      elementType: "section",
      title: "User details",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...firstNameInput,
            },
            {
              elementType: "input",
              type: "text",
              ...lastNameInput,
            },
          ],
        },
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...emailInput,
            },
          ],
        },
      ],
    },
    {
      elementType: "section",
      title: "Address",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "select",
              options: "{{countryOptions|string[]}}",
              optionsType: "dynamic",
              ...countryInput,
            },
            {
              elementType: "input",
              options: "{{stateOptions|string[]}}",
              optionsType: "dynamic",
              type: "select",
              ...stateInput,
            },
          ],
        },
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...addressLineOneInput,
            },
            {
              elementType: "input",
              type: "text",
              ...addressLineTwoInput,
            },
          ],
        },
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...cityInput,
            },
            {
              elementType: "input",
              type: "text",
              ...intersectionInput,
            },
          ],
        },
        {
          elementType: "row",
          className: "w-1/2",
          children: [
            {
              elementType: "input",
              type: "text",
              ...zipCodeInput,
            },
          ],
        },
      ],
    },
    {
      className: "!mt-xxlarge",
      elementType: "row",
      children: [
        {
          elementType: "button",
          type: "submit",
          ...submit,
        },
      ],
    },
  ],
  version: 0,
};

export const externalAccountDetailsFormSchema: FormSchema = {
  id: "account-details-form",
  children: [
    {
      elementType: "section",
      title: "Contact Info",
      className: "!mb-xxxlarge",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "contact",
              ...requiredPhoneInput,
            },
            {
              elementType: "input",
              type: "contact",
              ...optionalPhoneInput,
            },
          ],
        },
      ],
    },
    {
      elementType: "section",
      title: "User details",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...firstNameInput,
            },
            {
              elementType: "input",
              type: "text",
              ...lastNameInput,
            },
          ],
        },
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...emailInput,
            },
          ],
        },
      ],
    },
    {
      elementType: "section",
      title: "Address",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "select",
              options: "{{countryOptions|string[]}}",
              optionsType: "dynamic",
              ...countryInput,
            },
            {
              elementType: "input",
              options: "{{stateOptions|string[]}}",
              optionsType: "dynamic",
              type: "select",
              ...stateInput,
            },
          ],
        },
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...addressLineOneInput,
            },
            {
              elementType: "input",
              type: "text",
              ...addressLineTwoInput,
            },
          ],
        },
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...cityInput,
            },
            {
              elementType: "input",
              type: "text",
              ...intersectionInput,
            },
          ],
        },
        {
          elementType: "row",
          className: "w-1/2",
          children: [
            {
              elementType: "input",
              type: "text",
              ...zipCodeInput,
            },
          ],
        },
      ],
    },
    {
      elementType: "section",
      description:
        "You understand and consent to the collection, storage and use of your personal data for the purposes outlined in the 24Petwatch Privacy Policy. Your personal data privacy rights are outlined therein.",
      title: "User Agreements",
      children: [
        {
          elementType: "input",
          hideLabel: true,
          id: "pet-health-services",
          label: "Consent to terms of service",
          options: [
            `With your 24Pet® microchip, Pethealth Services (USA) Inc. ("PSU") may offer you free lost pet services, as well as exclusive offers, promotions and the latest information from 24Pet regarding microchip services. Additionally, PSU's affiliates, including PTZ Insurance Agency, Ltd., PetPartners, Inc. and Independence Pet Group, Inc., and their subsidiaries (collectively, "PTZ") may offer you promotions and the latest information regarding pet insurance services and products. PSU may also have or benefit from contractual arrangements with third parties ("Partners") who may offer you related services, products, offers and/or promotions.By giving consent, you agree that PSU, its Partners and/or PTZ may contact you for the purposes identified herein via commercial electronic messages at the e-mail address you provided, via mailer at the mailing address you provided and/or via automatic telephone dialing systems, pre-recorded/automated messages and/or text messages at the telephone number(s) you provided. Data and message rates may apply. This consent is not a condition of the purchase of any goods or services. You understand that if you choose not to provide your consent, you will not receive the above-mentioned communications or free lost pet services, which includes being contacted with information in the event that your pet goes missing.You may withdraw your consent at any time.`,
          ],
          requiredCondition: true,
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
          requiredCondition: true,
          type: "checkboxGroup",
        },
      ],
    },
    {
      className: "!mt-xxlarge",
      elementType: "row",
      children: [
        {
          elementType: "button",
          type: "submit",
          ...submit,
        },
      ],
    },
  ],
  version: 0,
};

export const emergencyContactFormSchema: FormSchema = {
  id: "emergency-contact-form",
  children: [
    {
      elementType: "section",
      title: "Emergency contact info",
      repeatingTitle: "Emergency contact",
      maxRepeat: 2,
      isRepeatable: true,
      id: "emergency-contact",
      children: [
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...firstNameInput,
              id: "contact-first-name",
            },
            {
              elementType: "input",
              type: "text",
              ...lastNameInput,
              id: "contact-last-name",
            },
          ],
        },
        {
          elementType: "row",
          children: [
            {
              elementType: "input",
              type: "text",
              ...emailInput,
              id: "contact-email-address",
            },
            {
              elementType: "input",
              hideSelect: true,
              id: "contact-phone",
              label: "Phone Number",
              requiredCondition: true,
              type: "contact",
            },
          ],
        },
      ],
    },
    {
      className: "!mt-xxlarge",
      elementType: "row",
      children: [
        {
          elementType: "button",
          type: "submit",
          ...submit,
        },
      ],
    },
  ],
  version: 0,
};
