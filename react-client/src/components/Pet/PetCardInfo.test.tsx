import { render, screen } from "@testing-library/react";
import { PetCardInfo } from "./PetCardInfo";
import { ComponentProps } from "react";

const { getByRole, getByText } = screen;

describe("PetCardInfo", () => {
  it.each(["Mark", "Joy"])("should render Title with given value", (name) => {
    getRenderer({ name });

    expect(getByRole("heading", { name })).toBeInTheDocument();
  });

  it("should render button 'Report lost pet'", () => {
    getRenderer();

    expect(
      getByRole("button", { name: "Report lost pet" })
    ).toBeInTheDocument();
  });

  it.each([333, 98234263])(
    "should render microchip info with given value",
    (microchipNumber) => {
      getRenderer({ microchipNumber });

      expect(getByText(`Microchip#: ${microchipNumber}`)).toBeInTheDocument();
    }
  );
});

function getRenderer({
  id = "testId",
  name = "Test pet card info",
  ...rest
}: Partial<ComponentProps<typeof PetCardInfo>> = {}) {
  return render(<PetCardInfo id={id} name={name} {...rest} />);
}
