import { render, screen } from "@testing-library/react";
import { getPetInfoTab, GetPetInfoTabProps } from "./getPetInfoTab";

const mockPetInfo = {
  age: "2 years",
  breed: "Labrador",
  dateOfBirth: "2021-05-01",
  mixedBreed: "No",
  sex: "Male",
  spayedNeutered: "Yes",
  species: "Dog",
};

const { getAllByRole } = screen;

describe("getPetInfoTab", () => {
  it("should render the given labels with its expected values", () => {
    getRenderer(mockPetInfo);

    const items = getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(`Age: ${mockPetInfo.age}`);
    expect(items[1]).toHaveTextContent(`Species: ${mockPetInfo.species}`);
    expect(items[2]).toHaveTextContent(`Sex: ${mockPetInfo.sex}`);
    expect(items[3]).toHaveTextContent(`Breed: ${mockPetInfo.breed}`);
    expect(items[4]).toHaveTextContent(`DOB: ${mockPetInfo.dateOfBirth}`);
    expect(items[5]).toHaveTextContent(
      `Mixed breed: ${mockPetInfo.mixedBreed}`
    );
    expect(items[6]).toHaveTextContent(
      `Spayed/Neutered: ${mockPetInfo.spayedNeutered}`
    );
  });

  it("should render field empty when no value is given", () => {
    getRenderer({
      age: "",
      breed: "",
      dateOfBirth: "",
      mixedBreed: "",
      sex: "",
      spayedNeutered: "",
      species: "",
    });

    const items = getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Age:");
    expect(items[1]).toHaveTextContent("Species:");
    expect(items[2]).toHaveTextContent("Sex:");
    expect(items[3]).toHaveTextContent("Breed:");
    expect(items[4]).toHaveTextContent("DOB:");
    expect(items[5]).toHaveTextContent("Mixed breed:");
    expect(items[6]).toHaveTextContent("Spayed/Neutered:");
  });
});

function getRenderer(petInfo: GetPetInfoTabProps) {
  return render(getPetInfoTab(petInfo));
}
