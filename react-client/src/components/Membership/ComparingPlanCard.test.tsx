import { render, screen } from "@testing-library/react";
import { ComparingPlanCard } from "./ComparingPlanCard";
import { ComponentProps } from "react";
import {
  CA_AVAILABLE_PLANS,
  US_AVAILABLE_PLANS,
} from "./utils/comparingPlansConstants";

const { getByRole, getByText } = screen;
describe("ComparingPlanCard", () => {
  it.each(["Test title", "Super title"])(
    "should render the given title= %s",
    (title) => {
      getRenderer({ title });
      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["Test description", "Super description"])(
    "should render the given description= %s",
    (description) => {
      getRenderer({ description });
      expect(getByText(description)).toBeInTheDocument();
    }
  );

  it.each([
    ["ca", CA_AVAILABLE_PLANS.length],
    ["us", US_AVAILABLE_PLANS.length],
  ])(
    "should render the number of icons matching the available plans offered on country='ca' ",
    (country, expected) => {
      // @ts-expect-error - ignoring for test purposes only
      getRenderer({ country });

      expect(document.querySelectorAll("svg").length).toBe(expected);
    }
  );

  it("should render icon as checkCircle when item it's available on plan", () => {
    getRenderer({ availableOnPlan: "all" });

    const allIcons = document.querySelectorAll("svg");
    expect(allIcons[0]).toHaveAttribute("data-file-name", "SvgCheckCircleIcon");
  });

  it("should render icon as clearCircle when item it's NOT available on plan", () => {
    getRenderer({ availableOnPlan: "lifetimePlus" });

    const allIcons = document.querySelectorAll("svg");
    expect(allIcons[0]).toHaveAttribute("data-file-name", "SvgClearCircleIcon");
  });
});

function getRenderer({
  availableOnPlan = "all",
  country = "us",
  description = "Random description",
  title = "Random title",
}: Partial<ComponentProps<typeof ComparingPlanCard>> = {}) {
  return render(
    <ComparingPlanCard
      availableOnPlan={availableOnPlan}
      country={country}
      description={description}
      title={title}
    />
  );
}
