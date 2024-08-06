import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PetCard } from "./PetCard";

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
    "should render pet image with correct source",
    (expected) => {
      getRenderer({ img: expected });
      expect(getByRole("img", { name: "Image of Buddy" })).toHaveAttribute(
        "src",
        expected
      );
    }
  );

  it.each(["Bob", "Lilly"])(
    "should render pet image with correct alt text %p",
    (expected) => {
      getRenderer({ name: expected });

      expect(
        getByRole("img", { name: `Image of ${expected}` })
      ).toBeInTheDocument();
    }
  );

  it.each(["a-class", "another-class"])(
    "should render with custom class %p",
    (expected) => {
      getRenderer({ classNames: { root: expected } });
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
    ["lg", "h-[240px]  lg:h-[372px] lg:max-w-[368px]"],
  ])("should match variant classes %p", (variant, expected) => {
    // @ts-expect-error - ignoring for test purposes only
    getRenderer({ variant });

    expect(getByRole("img").parentElement).toHaveClass(expected);
  });
});

type Props = Partial<ComponentProps<typeof PetCard>>;

function getRenderer({
  children = DEFAULT_CHILDREN,
  name = "Buddy",
  ...rest
}: Props = {}) {
  return render(
    <PetCard name={name} {...rest}>
      {children}
    </PetCard>
  );
}
