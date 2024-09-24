import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { PetServices } from "~/domain/models/pet/PetModel";
import { PetWatchSection } from "./PetWatchSection";

const { getByRole, getByText, queryByRole } = screen;

const MOCK_PET_SERVICE_STATUS: PetServices = {
  locale: "US",
  membershipStatus: "Annual member",
  products: [],
};

const ACTIVE_MESSAGE =
  /Continue to enjoy premium benefits and top-notch care for your pet from or products and partners\./i;
const EXPIRED_MESSAGE =
  /Renew services to continue enjoying premium benefits and top-notch care for your pet from or products and partners\./i;
const STANDARD_MESSAGE =
  /If your pet ever goes missing and is found, they can be scanned at a vet or animal shelter to identify their microchip number. When the chip number is shared with 24Petwatch, you'll be notified using the consent and information on file\. This may include email, automated phone call and SMS\. Be sure to keep your contact details up-to-date\./i;
const ACTIVE_BUTTON_LABEL = /See all my benefits/i;
const EXPIRED_BUTTON_LABEL = "Renew services";
const STANDARD_BUTTON_LABEL = /See details/i;
const ACTIVE_PET_SERVICES_LABEL = /Active Pet Services/i;

describe("PetWatchSection", () => {
  it(`should render the text ${ACTIVE_PET_SERVICES_LABEL}`, () => {
    getRenderer();
    expect(getByText(ACTIVE_PET_SERVICES_LABEL)).toBeInTheDocument();
  });
  it("should render the petWatch title", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Lost Pet Protection/i })
    ).toBeInTheDocument();
  });

  it.each([
    ["Annual member", /Active Annual Membership/i, []],
    [
      "Annual member",
      /Expired Services/i,
      [{ id: "test", name: "test", isExpired: true }],
    ],
    ["Lifetime protect member", /Active Lifetime Membership/i, []],
    ["Lifetime plus protect member", /Active Lifetime plus Membership/i, []],
    ["Not a member", /Standard Protection/i, []],
  ])(
    "should render the %p petServiceStatus with the tag as %s",
    (membershipStatus, expectedTag, products) => {
      getRenderer({
        petServiceStatus: {
          membershipStatus,
          products,
        },
      });
      expect(getByText(expectedTag)).toBeInTheDocument();
    }
  );

  it.each([
    ["Annual member", ACTIVE_MESSAGE, []],
    [
      "Annual member",
      EXPIRED_MESSAGE,
      [{ id: "test", name: "test", isExpired: true }],
    ],
    ["Lifetime protect member", ACTIVE_MESSAGE, []],
    ["Lifetime plus protect member", ACTIVE_MESSAGE, []],
    ["Not a member", STANDARD_MESSAGE, []],
  ])(
    "should render the %p petServiceStatus with the text as %s",
    (membershipStatus, expectedMessage, products) => {
      getRenderer({
        petServiceStatus: {
          membershipStatus,
          products,
        },
      });
      expect(getByText(expectedMessage)).toBeInTheDocument();
    }
  );

  it.each([
    ["Annual member", ACTIVE_BUTTON_LABEL, []],
    [
      "Annual member",
      EXPIRED_BUTTON_LABEL,
      [{ id: "test", name: "test", isExpired: true }],
    ],
    ["Lifetime protect member", ACTIVE_BUTTON_LABEL, []],
    ["Lifetime plus protect member", ACTIVE_BUTTON_LABEL, []],
    ["Not a member", STANDARD_BUTTON_LABEL, []],
  ])(
    "should render the %p petServiceStatus with the button label as %s",
    (membershipStatus, expectedButtonLabel, products) => {
      getRenderer({
        petServiceStatus: {
          membershipStatus,
          products,
        },
      });
      expect(getByText(expectedButtonLabel)).toBeInTheDocument();
    }
  );

  it("should not render section when membershipStatus is 'Annual member' and locale is 'CA'", () => {
    getRenderer({
      petServiceStatus: { ...MOCK_PET_SERVICE_STATUS, locale: "CA" },
    });
    expect(
      queryByRole("heading", { name: /Lost Pet Protection/i })
    ).not.toBeInTheDocument();
  });
});

function getRenderer({
  petServiceStatus = MOCK_PET_SERVICE_STATUS,
}: Partial<ComponentProps<typeof PetWatchSection>> = {}) {
  return render(
    <MemoryRouter>
      <PetWatchSection petServiceStatus={petServiceStatus} />
    </MemoryRouter>
  );
}
