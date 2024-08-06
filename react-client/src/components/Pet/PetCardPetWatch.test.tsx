import { render, screen } from "@testing-library/react";
import { PetCardPetWatch } from "./PetCardPetWatch";

const { getByText } = screen;

describe("PetCardPetWatch", () => {
  it.each([
    "24/7 Lost Pet Support",
    "Lost Pet Recovery Specialists",
    "DirectConnect",
    "$30 Rover Discount",
    "$25 Petco Coupon",
    "24PetMedAlert",
    "24/7 Vet Helpline",
    "Customized Pet Training",
    "Lifetime Warranty ID Tag",
  ])("should render all options on card", (text) => {
    getRenderer();

    expect(getByText(text)).toBeInTheDocument();
  });

  it("should render disabled option with correct styles and Renew button", () => {
    getRenderer();
    const disabledOption = screen.getByText("Customized Pet Training");
    expect(disabledOption).toBeInTheDocument();
    expect(disabledOption).toHaveClass("text-neutral-500");
    expect(screen.getByText("Renew")).toBeInTheDocument();
  });

  it("should render enabled option with correct styles and chevron icon", () => {
    getRenderer();
    const enabledOption = screen.getByText("24/7 Lost Pet Support");
    expect(enabledOption).toBeInTheDocument();
    expect(enabledOption).toHaveClass("text-black");
    const iconButton = document.querySelectorAll("svg")[1];
    expect(iconButton).toHaveAttribute("data-file-name", "SvgChevronRightIcon");
  });

  it("should render status text correctly", () => {
    getRenderer();
    expect(getByText(/expired/i)).toBeInTheDocument();
  });
});

function getRenderer() {
  return render(<PetCardPetWatch />);
}
