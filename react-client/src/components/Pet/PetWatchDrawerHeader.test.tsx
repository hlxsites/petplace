import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { ASSET_IMAGES } from "~/assets";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";
import { useRenewMembershipContext } from "~/routes/my-pets/petId/useRenewMembershipViewModel";

// Mock the context hook
jest.mock("~/routes/my-pets/petId/useRenewMembershipViewModel", () => ({
  useRenewMembershipContext: jest.fn(),
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
    (useRenewMembershipContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  it("should render default title when no contentDetails is provided", async () => {
    mockContextValue.getContentDetails.mockReturnValue(null);
    await getRenderer();
    expect(
      getByText("Here is all the available benefits and perks")
    ).toBeInTheDocument();
  });

  it("should render Pet Watch Logo when no contentDetails is provided", async () => {
    mockContextValue.getContentDetails.mockReturnValue(null);
    await getRenderer();
    expect(getByRole("img")).toHaveAttribute("src", ASSET_IMAGES.petWatchLogo);
  });

  it("should NOT render button when no contentDetails is provided", async () => {
    mockContextValue.getContentDetails.mockReturnValue(null);
    await getRenderer();
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should NOT render default title when there is content", async () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    await getRenderer();
    expect(
      queryByText("Here is all the available benefits and perks")
    ).not.toBeInTheDocument();
  });

  it("should NOT render Pet Watch Logo when there is content", async () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    await getRenderer();
    expect(queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render content title when contentDetails is provided", async () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    await getRenderer();
    expect(
      queryByRole("heading", { name: DEFAULT_CONTENT.title })
    ).toBeInTheDocument();
  });

  it("should render content subtitle when contentDetails is provided", async () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    await getRenderer();
    expect(getByText(DEFAULT_CONTENT.subtitle)).toBeInTheDocument();
  });

  it("should call handleContentChange callback", async () => {
    mockContextValue.getContentDetails.mockReturnValue(DEFAULT_CONTENT);
    await getRenderer();

    await userEvent.click(getByRole("button", { name: "go back" }));
    expect(mockContextValue.handleContentChange).toHaveBeenCalled();
  });
});

async function getRenderer({
  serviceStatus = "Annual member",
  ...props
}: Partial<ComponentProps<typeof PetWatchDrawerHeader>> = {}) {
  const rendered = render(
    <PetWatchDrawerHeader serviceStatus={serviceStatus} {...props} />
  );

  // Wait for the SuspenseAwait to resolve
  await screen.findByText(
    /(Test title|Here is all the available benefits and perks)/
  );

  return rendered;
}
