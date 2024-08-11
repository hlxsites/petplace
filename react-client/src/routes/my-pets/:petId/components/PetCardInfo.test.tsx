import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PetCardInfo } from "./PetCardInfo";
import { MemoryRouter } from "react-router-dom";

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

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();
    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  id = "testId",
  name = "Test pet card info",
  ...rest
}: Partial<ComponentProps<typeof PetCardInfo>> = {}) {
  return render(
    <MemoryRouter initialEntries={["/test"]}>
      <PetCardInfo id={id} name={name} {...rest} />
    </MemoryRouter>
  );
}
