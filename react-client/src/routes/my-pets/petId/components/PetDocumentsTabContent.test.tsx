import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PET_DOCUMENT_TYPES_LIST } from "../utils/petDocumentConstants";
import { PetDocumentsTabContent } from "./PetDocumentsTabContent";

const { getByText, getAllByRole } = screen;

jest.mock("../usePetProfileLayoutViewModel", () => ({
  usePetProfileContext: () => ({
    documentTypes: PET_DOCUMENT_TYPES_LIST,
  }),
}));

describe("<PetDocumentsTabContent />", () => {
  it("should render all number of cards defined on the function", () => {
    getRenderer();

    expect(getAllByRole("listitem")).toHaveLength(4);
  });

  it.each([
    ["Medical Records", "Medicine"],
    ["Vaccines", "Syringe"],
    ["Tests", "Pippet"],
    ["Other documents", "File"],
  ])("should render correct content for %p", (label, icon) => {
    getRenderer();

    const item = getByText(label).closest("div[role='listitem']");
    expect(item?.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      `Svg${icon}Icon`
    );
  });
});

function getRenderer() {
  return render(
    <MemoryRouter>
      <PetDocumentsTabContent />
    </MemoryRouter>
  );
}
