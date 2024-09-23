import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MembershipPlan } from "~/domain/checkout/CheckoutModels";
import {
  ANNUAL_PROTECTION_PLAN_TITLE,
  LIFETIME_PLAN_TITLE,
  LIFETIME_PLUS_PLAN_TITLE,
} from "~/domain/useCases/checkout/GetCheckoutUseCase";
import { MembershipComparingPlanTable } from "./MembershipComparingPlanTable";

const { getAllByRole, getByRole, getByText } = screen;

describe("MembershipComparingPlanTable", () => {
  it("should render the table with columns and rows", () => {
    getRenderer();

    // Verify columns are rendered
    PLANS.forEach(({ title }) => {
      expect(getByText(title)).toBeInTheDocument();
    });

    // Verify rows are rendered
    ROWS.forEach((row) => {
      expect(getByText(row.title)).toBeInTheDocument();
      expect(getByText(row.label)).toBeInTheDocument();
    });
  });

  it("should render the correct icons based on availability", () => {
    getRenderer();

    const firstRow = getAllByRole("row")[1];
    const secondRow = getAllByRole("row")[2];

    expect(firstRow.querySelectorAll(".text-green-300").length).toBe(2);
    expect(firstRow.querySelectorAll(".text-red-300").length).toBe(1);

    expect(secondRow.querySelectorAll(".text-green-300").length).toBe(1);
    expect(secondRow.querySelectorAll(".text-red-300").length).toBe(2);
  });

  it("should render action buttons and handles click events", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });

    let clickCount = 0;
    for (const { comparePlansButtonLabel } of PLANS) {
      const button = getByRole("button", { name: comparePlansButtonLabel });
      expect(button).toBeInTheDocument();
      // Expect the previous click count
      expect(onClick).toHaveBeenCalledTimes(clickCount);

      await userEvent.click(button);
      // Increment the click count after each click
      clickCount += 1;
      // Validate the new click count
      expect(onClick).toHaveBeenCalledTimes(clickCount);
    }
  });
});

// Test helpers
type Props = ComponentProps<typeof MembershipComparingPlanTable>;
function getRenderer({
  onClick,
  plans = PLANS,
  rows = ROWS,
}: Partial<Props> = {}) {
  return render(
    <MembershipComparingPlanTable onClick={onClick} plans={plans} rows={rows} />
  );
}

// Mock data
const PLANS: Props["plans"] = [
  {
    comparePlansButtonLabel: "Action 1",
    isHighlighted: false,
    title: ANNUAL_PROTECTION_PLAN_TITLE,
  },
  {
    comparePlansButtonLabel: "Action 2",
    isHighlighted: true,
    title: LIFETIME_PLAN_TITLE,
  },
  {
    comparePlansButtonLabel: "Action 3",
    isHighlighted: false,
    title: LIFETIME_PLUS_PLAN_TITLE,
  },
];
const ROWS = [
  {
    label: "Label 1",
    title: "Title 1",
    availableColumns: [
      LIFETIME_PLAN_TITLE,
      LIFETIME_PLUS_PLAN_TITLE,
    ] satisfies MembershipPlan[],
  },
  {
    label: "Label 2",
    title: "Title 2",
    availableColumns: [ANNUAL_PROTECTION_PLAN_TITLE] satisfies MembershipPlan[],
  },
];
