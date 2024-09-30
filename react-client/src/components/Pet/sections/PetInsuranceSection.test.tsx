import { render, screen } from "@testing-library/react";
import { PetInsuranceSection } from "./PetInsuranceSection";
import { MemoryRouter } from "react-router-dom";
import { ComponentProps } from "react";

const BUTTON_LABEL = /View insurance details/i;
const EXTERNAL_URL =
  "https://mph-qay.pethealthinc.com/external/petplacelogin?redirecturl=petplace/policy?animalID=";
const TITLE_LABEL = /See pet's insurance in MyPetHealth/i;

const { getByRole } = screen;

describe("PetInsuranceSection", () => {
  it(`should render the section title as ${TITLE_LABEL}`, () => {
    getRenderer();
    expect(getByRole("heading", { name: TITLE_LABEL })).toBeInTheDocument();
  });

  it(`should render the linkButton as ${BUTTON_LABEL}`, () => {
    getRenderer();
    expect(getByRole("link", { name: BUTTON_LABEL })).toBeInTheDocument();
  });

  it.each(["Test1", "Test2"])(
    "should link to the correct external URL with dynamic petId",
    (petId) => {
      getRenderer({ petId });
      const link = screen.getByRole("link", { name: BUTTON_LABEL });
      expect(link).toHaveAttribute("href", `${EXTERNAL_URL}${petId}`);
    }
  );

  it("should open the link in a new tab", () => {
    getRenderer();
    const link = screen.getByRole("link", { name: BUTTON_LABEL });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

function getRenderer({
  petId = "AmazingPet",
}: Partial<ComponentProps<typeof PetInsuranceSection>> = {}) {
  return render(
    <MemoryRouter>
      <PetInsuranceSection petId={petId} />
    </MemoryRouter>
  );
}
