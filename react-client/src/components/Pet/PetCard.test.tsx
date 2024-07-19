import { render, screen } from "@testing-library/react";
import { PetCard } from "./PetCard";
import { ComponentProps } from "react";

const { getByRole, getByText, getByTestId } = screen;

const DEFAULT_NAME = "Romã";

describe("PetCard", () => {
  it.each(["A name", "Another name"])("should render name '%s'", (expected) => {
    getRenderer({ name: expected });
    expect(getByText(expected)).toBeInTheDocument();
  });

  it.each(["An image", "Another image"])("should render image", (expected) => {
    getRenderer({ img: expected });
    expect(getByRole("img")).toHaveAttribute("src", expected);
  });

  it("should render image alt", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute(
      "alt",
      `Pet's name: ${DEFAULT_NAME}`
    );
  });

  it("should always have a shadow", () => {
    getRenderer();
    const wrapperCard = getByTestId("pet-card").parentElement;
    expect(wrapperCard).toHaveClass("shadow-elevation-1");
  });

  it.each([
    { isProtected: true, name: "ShieldGood" },
    { isProtected: false, name: "ShieldOff" },
  ])(
    "should render icon according to isProtected status",
    ({ isProtected, name }) => {
      const { container } = getRenderer({ isProtected });

      expect(container.querySelector("svg")).toHaveAttribute(
        "data-file-name",
        `Svg${name}Icon`
      );
    }
  );

  it.each([
    {
      isProtected: true,
      classes: "bg-success-background text-success-contrast",
    },
    { isProtected: false, classes: "bg-error-background text-error-contrast" },
  ])(
    "should render classes according to isProtected status",
    ({ isProtected, classes }) => {
      const { container } = getRenderer({ isProtected });

      expect(
        container.querySelector("svg")?.parentElement?.parentElement
      ).toHaveClass(classes);
    }
  );

  it("should match snapshot to assure correct rendering", () => {
    const { container } = getRenderer();
    expect(container).toMatchSnapshot();
  });
});

function getRenderer({
  isProtected = true,
  name = DEFAULT_NAME,
  ...rest
}: Partial<ComponentProps<typeof PetCard>> = {}) {
  return render(<PetCard isProtected={isProtected} name={name} {...rest} />);
}
