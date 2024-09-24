import { render, screen } from "@testing-library/react";
import { PetInsuranceSection } from "./PetInsuranceSection";
import { MemoryRouter } from "react-router-dom";

const BUTTON_LABEL = /View insurance details/i;
const EXTERNAL_URL = "https://www.mypethealth.com/external/petplacelogin";
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

  it("should link to the correct external URL", () => {
    getRenderer();
    const link = screen.getByRole("link", { name: BUTTON_LABEL });
    expect(link).toHaveAttribute("href", EXTERNAL_URL);
  });

  it("should open the link in a new tab", () => {
    getRenderer();
    const link = screen.getByRole("link", { name: BUTTON_LABEL });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

function getRenderer() {
  return render(
    <MemoryRouter>
      <PetInsuranceSection />
    </MemoryRouter>
  );
}
