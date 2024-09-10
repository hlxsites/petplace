import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PlanBenefitCard } from "./PlanBenefitCard";

const { getByText } = screen;

describe("PlanBenefitCard", () => {
  it.each(["A title", "Another title"])(
    "should render the given title = %s",
    (expected) => {
      getRenderer({ title: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["A label", "Another label"])(
    "should render the given label = %s",
    (expected) => {
      getRenderer({ label: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each([
    [true, "CheckCircle"],
    [false, "ClearCircle"],
  ])(
    "should render isAvailable=%s correct icon: %s",
    (isAvailable, iconName) => {
      const { container } = getRenderer({ isAvailable });
      expect(container.querySelector("svg")).toHaveAttribute(
        "data-file-name",
        `Svg${iconName}Icon`
      );
    }
  );

  it.each([
    [true, "text-green-300"],
    [false, "text-red-300"],
  ])(
    "should render isAvailable=%s correct class: %s",
    (isAvailable, expected) => {
      const { container } = getRenderer({ isAvailable });
      expect(container.querySelector("svg")?.parentElement).toHaveClass(
        expected
      );
    }
  );
});

function getRenderer({
  isAvailable = true,
  label = "Test label",
  title = "Test title",
}: Partial<ComponentProps<typeof PlanBenefitCard>> = {}) {
  return render(
    <PlanBenefitCard label={label} title={title} isAvailable={isAvailable} />
  );
}
