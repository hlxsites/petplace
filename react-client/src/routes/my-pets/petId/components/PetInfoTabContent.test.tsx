import { render, screen } from "@testing-library/react";
import { GetPetInfoTabProps, PetInfoTabContent } from "./PetInfoTabContent";

const mockPetInfo = {
  age: "2 years",
  breed: "Labrador",
  dateOfBirth: "2021-05-01T00:00:00",
  mixedBreed: false,
  sex: "1",
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
    expect(items[2]).toHaveTextContent("Sex: Male");
    expect(items[3]).toHaveTextContent(`Breed: ${mockPetInfo.breed}`);
    expect(items[4]).toHaveTextContent("DOB: 01/05/2021");
    expect(items[5]).toHaveTextContent("Mixed breed: No");
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
      mixedBreed: undefined,
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
