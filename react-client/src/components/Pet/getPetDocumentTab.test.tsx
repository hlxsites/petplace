import { render, screen } from "@testing-library/react";
import { getPetDocumentsTab } from "./getPetDocumentsTab";

const { getByText, getAllByRole } = screen;

describe("getPetDocumentTab", () => {
  it("should render all number of cards defined on the function", () => {
    getRenderer();

    expect(getAllByRole("listitem")).toHaveLength(4);
  });

  it.each([
    ["Medical Records", "Medicine"],
    ["Vaccines", "Syringe"],
    ["Tests", "Pippet"],
    ["Other documents", "File"],
  ])("should render correct content for each item", (label, icon) => {
    getRenderer();

    const item = getByText(label).closest("div[role='listitem']");

    expect(item).toBeInTheDocument();

    expect(item).not.toBeNull();
    expect(item?.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      `Svg${icon}Icon`
    );
  });
});

function getRenderer() {
  return render(getPetDocumentsTab());
}
