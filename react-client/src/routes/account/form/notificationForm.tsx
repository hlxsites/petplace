import { FormSchema, InputsUnion, Text } from "~/components/design-system";

const newsletterRadioGroupInput: InputsUnion = {
  className: "flex flex-row justify-end !gap-large",
  elementType: "input",
  hideLabel: true,
  id: "newsletter",
  label: "Newsletter",
  options: ["Cat", "Dog"],
  type: "checkboxGroup",
  variant: "purple",
};

const petPlaceOffersSwitchInput: InputsUnion = {
  className: "flex flex-row justify-end -mt-[12px]",
  elementType: "input",
  id: "pet-place-offers",
  label: "PetPlace Offers",
  conditionalLabel: ["On", "Off"],
  type: "switch",
  variant: "purple",
};

const partnerOffersSwitchInput: InputsUnion = {
  className: "flex flex-row justify-end -mt-[12px]",
  elementType: "input",
  id: "partner-offers",
  label: "Partner Offers",
  conditionalLabel: ["On", "Off"],
  type: "switch",
  variant: "purple",
};

const petPlaceAdoptAlertsRadioGroupInput: InputsUnion = {
  className: "flex flex-row justify-end !gap-large ",
  elementType: "input",
  hideLabel: true,
  id: "pet-place-adopt-alerts",
  label: "PetPlace Adopt Alerts",
  options: ["SMS", "Email"],
  type: "checkboxGroup",
  variant: "purple",
};

export const notificationsFormSchema: FormSchema = {
  id: "account-notifications-form",
  children: [
    {
      elementType: "section",
      title: {
        label: "Offers and Resources",
        level: "h3",
        size: "24",
      },
      children: [
        {
          elementType: "row",
          className: "flex flex-row",
          children: [
            {
              content: (
                <div className="grid">
                  <Text fontFamily="raleway" fontWeight="bold" size="18">
                    Newsletter
                  </Text>
                  <Text size="16">Receive our PetPlace Newsletter</Text>
                </div>
              ),
              elementType: "html",
            },
            newsletterRadioGroupInput,
          ],
        },
        {
          elementType: "row",
          className: "flex flex-row",
          children: [
            {
              content: (
                <div className="grid">
                  <Text fontFamily="raleway" fontWeight="bold" size="18">
                    PetPlace Offers
                  </Text>
                  <Text size="16">
                    Get updates on the latest PetPlace happenings
                  </Text>
                </div>
              ),
              elementType: "html",
            },
            petPlaceOffersSwitchInput,
          ],
        },
        {
          elementType: "row",
          className: "flex flex-row",
          children: [
            {
              content: (
                <div className="grid">
                  <Text fontFamily="raleway" fontWeight="bold" size="18">
                    Partner Offers
                  </Text>
                  <Text size="16">
                    Receive updates from PetPlace and our trusted partners
                  </Text>
                </div>
              ),
              elementType: "html",
            },
            partnerOffersSwitchInput,
          ],
        },
      ],
    },
    {
      elementType: "section",
      title: {
        label: "Notifications",
        level: "h3",
        size: "24",
      },
      className: "!mt-xxxlarge",
      children: [
        {
          elementType: "row",
          className: "flex flex-row",
          children: [
            {
              content: (
                <div className="grid">
                  <Text fontFamily="raleway" fontWeight="bold" size="18">
                    PetPlace Adopt Alerts
                  </Text>
                  <Text size="16">Receive adoption related updates</Text>
                </div>
              ),
              elementType: "html",
            },
            petPlaceAdoptAlertsRadioGroupInput,
          ],
        },
      ],
    },
    {
      elementType: "row",
      className: "grid justify-end !mt-xxxlarge",
      children: [
        {
          elementType: "button",
          enabledCondition: true,
          id: "submit-button",
          label: "Save changes",
          type: "submit",
        },
      ],
    },
  ],
  version: 0,
};
