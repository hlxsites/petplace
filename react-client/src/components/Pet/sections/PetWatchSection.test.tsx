import { render, screen } from "@testing-library/react";
import { PetWatchSection } from "./PetWatchSection";
import { ComponentProps } from "react";

const { getByRole } = screen;

describe("PetWatchSection", () => {
  it("should render the petWatch logo", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("alt", "24 Pet Watch logo");
  });
});

function getRenderer({
  petServiceType = "standard",
}: Partial<ComponentProps<typeof PetWatchSection>> = {}) {
  return render(<PetWatchSection petServiceType={petServiceType} />);
}
