import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { PetCardInfo } from "./PetCardInfo";

const { getByRole, getByText } = screen;

// TODO: must mock the usePetProfileContext hook to fix the tests
describe.skip("PetCardInfo", () => {
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

  it.each(["333", "ab98234263"])(
    "should render microchip info with given value",
    (microchip) => {
      getRenderer({ microchip });

      expect(getByText(`Microchip#: ${microchip}`)).toBeInTheDocument();
    }
  );

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();
    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  id = "testId",
  missingStatus = "found",
  name = "Test pet card info",
  ...rest
}: Partial<ComponentProps<typeof PetCardInfo>> = {}) {
  return render(
    <MemoryRouter initialEntries={["/test"]}>
      <PetCardInfo
        id={id}
        missingStatus={missingStatus}
        name={name}
        {...rest}
      />
    </MemoryRouter>
  );
}
