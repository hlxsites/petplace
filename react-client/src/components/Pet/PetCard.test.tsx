import { render, screen } from "@testing-library/react";
import { PetCard } from "./PetCard";
import { ComponentProps } from "react";

const { getByRole, getByText } = screen;

const DEFAULT_CHILDREN = "Test children";

describe("PetCard", () => {
  it.each(["A children", "Another children"])(
    "should render children",
    (children) => {
      getRenderer({ children });

      expect(getByText(children)).toBeInTheDocument();
    }
  );

  it.each(["a-src", "another-src"])(
    "should render img with alt '%s'",
    (expected) => {
      getRenderer({ img: expected });

      expect(getByRole("img")).toHaveAttribute("src", expected);
    }
  );

  it.each(["a name", "another name"])(
    "should render img with alt '%s'",
    (expected) => {
      getRenderer({ name: expected });

      expect(getByRole("img")).toHaveAttribute("alt", expected);
    }
  );

  it.each(["a-class", "another-class"])(
    "should render with custom class '%s'",
    (expected) => {
      getRenderer({ classNames: { root: expected } });
      screen.debug();

      expect(getByText(DEFAULT_CHILDREN)).toHaveClass(expected);
    }
  );

  it("should render badge", () => {
    const { container } = getRenderer({
      displayProtectedBadge: { isProtected: true },
    });

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should not render badge", () => {
    const { container } = getRenderer();

    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it.each([
    [true, "ShieldGood"],
    [false, "ShieldOff"],
  ])("should render icons accordingly", (isProtected, expected) => {
    const { container } = getRenderer({
      displayProtectedBadge: { isProtected },
    });

    expect(container.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      `Svg${expected}Icon`
    );
  });

  it.each([
    [true, "bg-success-background text-success-contrast"],
    [false, "bg-error-background text-error-contrast"],
  ])("should render classes accordingly", (isProtected, expected) => {
    const { container } = getRenderer({
      displayProtectedBadge: { isProtected },
    });

    expect(
      container.querySelector("svg")?.parentElement?.parentElement
    ).toHaveClass(expected);
  });

  it.each([
    ["sm", "h-[191px] lg:h-[246px]"],
    ["md", "h-[246px] lg:max-h-[306px]"],
    ["lg", "h-[240px]  lg:h-[343px] lg:max-w-[368px]"],
  ])("should match variant classes", (variant, expected) => {
    getRenderer({
      variant: variant as Props["variant"]
    });

    expect(getByRole("img").parentElement).toHaveClass(expected);
  });
});

type Props = Partial<ComponentProps<typeof PetCard>>

function getRenderer({
  children = DEFAULT_CHILDREN,
  name = "Test pet card name",
  ...rest
}: Props = {}) {
  return render(
    <PetCard name={name} {...rest}>
      {children}
    </PetCard>
  );
}
