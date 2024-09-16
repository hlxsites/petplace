import { render, screen } from "@testing-library/react";
import { GetPetInfoTabProps, PetInfoTabContent } from "./PetInfoTabContent";

const mockPetInfo = {
  age: "2 years",
  breed: "Labrador",
  dateOfBirth: "2021-05-01",
  mixedBreed: "No",
  sex: "Male",
  spayedNeutered: true,
  species: "Dog",
};

const { getAllByRole } = screen;

describe("<PetInfoTabContent />", () => {
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
    expect(items[6]).toHaveTextContent("Spayed/Neutered: Yes");
  });

  it("should render Spayed/Neutered: No", () => {
    getRenderer({
      ...mockPetInfo,
      spayedNeutered: false,
    });

    const items = getAllByRole("listitem");
    expect(items[6]).toHaveTextContent("Spayed/Neutered: No");
  });

  it("should render field empty when no value is given", () => {
    getRenderer({
      age: "",
      breed: "",
      dateOfBirth: "",
      mixedBreed: "",
      sex: "",
      spayedNeutered: undefined,
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
  return render(PetInfoTabContent(petInfo));
}
