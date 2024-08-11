import { render, screen } from "@testing-library/react";
import { PetCardOption } from "./PetCardOption";
import { ComponentProps } from "react";
import { Button, Icon, Text } from "../design-system";

const { getByText, getByRole } = screen;

describe("PetCardOption", () => {
  it("should render the given icon", () => {
    getRenderer({
      iconLeft: <Icon display="chevronDown" />,
    });
    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgChevronDownIcon"
    );
  });

  it("should render the given text", () => {
    getRenderer({
      text: <Text>My awesome test</Text>,
    });
    expect(getByText(/my awesome test/i)).toBeInTheDocument();
  });

  it("should render the given action button", () => {
    getRenderer({ actionButton: <Button>My test button</Button> });
    expect(
      getByRole("button", { name: /my test button/i })
    ).toBeInTheDocument();
  });
});

function getRenderer({
  ...props
}: Partial<ComponentProps<typeof PetCardOption>> = {}) {
  return render(<PetCardOption {...props} />);
}
