import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PetWatchSection } from "./PetWatchSection";
import { MemoryRouter } from "react-router-dom";

const { getByRole, getByText } = screen;

const ACTIVE_MESSAGE =
  /Continue to enjoy premium benefits and top-notch care for your pet from or products and partners\./i;
const EXPIRED_MESSAGE =
  /Renew services to continue enjoying premium benefits and top-notch care for your pet from or products and partners\./i;
const STANDARD_MESSAGE =
  /If your pet ever goes missing and is found, they can be scanned at a vet or animal shelter to identify their microchip number. When the chip number is shared with 24Petwatch, you'll be notified using the consent and information on file\. This may include email, automated phone call and SMS\. Be sure to keep your contact details up-to-date\./i;
const ACTIVE_BUTTON_LABEL = /See all my benefits/i;
const EXPIRED_BUTTON_LABEL = "Renew services";
const STANDARD_BUTTON_LABEL = /See details/i;

describe("PetWatchSection", () => {
  it("should render the petWatch logo", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("alt", "24 Pet Watch logo");
  });

  it.each([
    ["annual", /Active Annual Membership/i],
    ["expired", /Expired Services/i],
    ["lifetime", /Active Lifetime Membership/i],
    ["lifetimePlus", /Active Lifetime plus Membership/i],
    ["standard", /Standard Protection/i],
  ])(
    "should render the %p petServiceStatus with the tag as %s",
    (petServiceStatus, expectedTag) => {
      // @ts-expect-error - ignoring type error for testing purposes
      getRenderer({ petServiceStatus });
      expect(getByText(expectedTag)).toBeInTheDocument();
    }
  );

  it.each([
    ["annual", ACTIVE_MESSAGE],
    ["expired", EXPIRED_MESSAGE],
    ["lifetime", ACTIVE_MESSAGE],
    ["lifetimePlus", ACTIVE_MESSAGE],
    ["standard", STANDARD_MESSAGE],
  ])(
    "should render the %p petServiceStatus with the text as %s",
    (petServiceStatus, expectedMessage) => {
      // @ts-expect-error - ignoring type error for testing purposes
      getRenderer({ petServiceStatus });
      expect(getByText(expectedMessage)).toBeInTheDocument();
    }
  );

  it.each([
    ["annual", ACTIVE_BUTTON_LABEL],
    ["expired", EXPIRED_BUTTON_LABEL],
    ["lifetime", ACTIVE_BUTTON_LABEL],
    ["lifetimePlus", ACTIVE_BUTTON_LABEL],
    ["standard", STANDARD_BUTTON_LABEL],
  ])(
    "should render the %p petServiceStatus with the button label as %s",
    (petServiceStatus, expectedButtonLabel) => {
      // @ts-expect-error - ignoring type error for testing purposes
      getRenderer({ petServiceStatus });
      expect(getByText(expectedButtonLabel)).toBeInTheDocument();
    }
  );
});

function getRenderer({
  petServiceStatus = "standard",
}: Partial<ComponentProps<typeof PetWatchSection>> = {}) {
  return render(
    <MemoryRouter>
      <PetWatchSection petServiceStatus={petServiceStatus} />
    </MemoryRouter>
  );
}
