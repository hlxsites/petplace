import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { ASSET_IMAGES } from "~/assets";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";

const { getByText, getByRole, queryByRole, queryByText } = screen;

const DEFAULT_CONTENT = {
  title: "Test title",
  subtitle: "Test subtitle",
  description: "Test description",
};

// TODO: Fix tests by mocking the view model
describe.skip("PetWatchDrawerHeader", () => {
  it("should render default title when no contentDetails is provided", () => {
    getRenderer();
    expect(
      getByText("Here is all the available benefits and perks")
    ).toBeInTheDocument();
  });

  it("should render Pet Watch Logo when no contentDetails is provided", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("src", ASSET_IMAGES.petWatchLogo);
  });

  it("should NOT render button when no contentDetails is provided", () => {
    getRenderer();
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should NOT render default title when there is content", () => {
    getRenderer();
    expect(
      queryByText("Here is all the available benefits and perks")
    ).not.toBeInTheDocument();
  });

  it("should NOT render Pet Watch Logo when there is content", () => {
    getRenderer();
    expect(queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render content title when contentDetails is provided", () => {
    getRenderer();
    expect(
      queryByRole("heading", { name: DEFAULT_CONTENT.title })
    ).toBeInTheDocument();
  });

  it("should render content subtitle when contentDetails is provided", () => {
    getRenderer();
    expect(getByText(DEFAULT_CONTENT.subtitle)).toBeInTheDocument();
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
