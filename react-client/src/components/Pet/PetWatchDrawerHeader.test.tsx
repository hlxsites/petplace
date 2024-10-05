import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { ASSET_IMAGES } from "~/assets";
import { usePetProfileContext } from "~/routes/my-pets/petId/usePetProfileLayoutViewModel";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";

// Mock the context hook
jest.mock("~/routes/my-pets/petId/usePetProfileLayoutViewModel", () => ({
  usePetProfileContext: jest.fn(),
}));

const { getByText, getByRole, queryByRole, queryByText } = screen;

const DEFAULT_CONTENT = {
  title: "Test title",
  subtitle: "Test subtitle",
  description: "Test description",
};

describe("PetWatchDrawerHeader", () => {
  const mockPetWatchBenefits = Promise.resolve({
    petWatchAvailableBenefits: [],
  });

  const mockContextValue = {
    petWatchBenefits: mockPetWatchBenefits,
    getContentDetails: jest.fn(),
    handleContentChange: jest.fn().mockReturnValue(jest.fn()),
  };

  beforeEach(() => {
    (usePetProfileContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  it("should render default title when no contentDetails is provided", () => {
    mockContextValue.getContentDetails.mockReturnValue(null);
    getRenderer();
    expect(
      getByText("Here is all the available benefits and perks")
    ).toBeInTheDocument();
  });

  it("should render Pet Watch Logo when no contentDetails is provided", () => {
    mockContextValue.getContentDetails.mockReturnValue(null);
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("src", ASSET_IMAGES.petWatchLogo);
  });

  it("should NOT render button when no contentDetails is provided", () => {
    mockContextValue.getContentDetails.mockReturnValue(null);
    getRenderer();
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should NOT render default title when there is content", () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    getRenderer();
    expect(
      queryByText("Here is all the available benefits and perks")
    ).not.toBeInTheDocument();
  });

  it("should NOT render Pet Watch Logo when there is content", () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    getRenderer();
    expect(queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render content title when contentDetails is provided", () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    getRenderer();
    expect(
      queryByRole("heading", { name: DEFAULT_CONTENT.title })
    ).toBeInTheDocument();
  });

  it("should render content subtitle when contentDetails is provided", () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    getRenderer();
    expect(getByText(DEFAULT_CONTENT.subtitle)).toBeInTheDocument();
  });

  it("should call handleContentChange callback", async () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    getRenderer();

    await userEvent.click(getByRole("button", { name: "go back" }));
    expect(mockContextValue.handleContentChange).toHaveBeenCalled();
  });
});

function getRenderer({
  serviceStatus = "Annual member",
  ...props
}: Partial<ComponentProps<typeof PetWatchDrawerHeader>> = {}) {
  return render(
    <PetWatchDrawerHeader serviceStatus={serviceStatus} {...props} />
  );
}
