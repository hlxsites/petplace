import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { ASSET_IMAGES } from "~/assets";
import { PetWatchDrawerHeader } from "./PetWatchDrawerHeader";

const { getByText, getByRole, queryByRole, queryByText } = screen;

const DEFAULT_CONTENT = {
  title: "Test title",
  subtitle: "Test subtitle",
  description: "Test description",
};

describe("PetWatchDrawerHeader", () => {
  it("should render title by default", () => {
    getRenderer();
    expect(
      getByText("Here is all the available benefits and perks")
    ).toBeInTheDocument();
  });

  it("should render Pet Watch Logo by default", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("src", ASSET_IMAGES.petWatchLogo);
  });

  it("should NOT render button by default", () => {
    getRenderer();
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should NOT render title when there is content", () => {
    getRenderer({ contentDetails: DEFAULT_CONTENT });
    expect(
      queryByText("Here is all the available benefits and perks")
    ).not.toBeInTheDocument();
  });

  it("should NOT render Pet Watch Logo when there is content", () => {
    getRenderer({ contentDetails: DEFAULT_CONTENT });
    expect(queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render content title", () => {
    getRenderer({ contentDetails: DEFAULT_CONTENT });
    expect(
      queryByRole("heading", { name: DEFAULT_CONTENT.title })
    ).toBeInTheDocument();
  });

  it("should render content subtitle", () => {
    getRenderer({ contentDetails: DEFAULT_CONTENT });
    expect(getByText(DEFAULT_CONTENT.subtitle)).toBeInTheDocument();
  });

  it("should call onClick callback", async () => {
    const onClick = jest.fn();
    getRenderer({ contentDetails: DEFAULT_CONTENT, onClick });

    await userEvent.click(getByRole("button", { name: "go back" }));
    expect(onClick).toHaveBeenCalled();
  });
});

function getRenderer({
  onClick = jest.fn(),
  ...props
}: Partial<ComponentProps<typeof PetWatchDrawerHeader>> = {}) {
  return render(<PetWatchDrawerHeader onClick={onClick} {...props} />);
}
