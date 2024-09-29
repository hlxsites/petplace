import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { MembershipPlanId } from "~/domain/checkout/CheckoutModels";
import { MembershipComparingPlanTable } from "./MembershipComparingPlanTable";

const { getAllByRole, getByText } = screen;

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

  it.todo("should render correct button link");
});

// Test helpers
type Props = ComponentProps<typeof MembershipComparingPlanTable>;
function getRenderer({ plans = PLANS, rows = ROWS }: Partial<Props> = {}) {
  return render(
    <MemoryRouter>
      <MembershipComparingPlanTable plans={plans} rows={rows} />
    </MemoryRouter>
  );
}

// Mock data
const PLANS: Props["plans"] = [
  {
    hardCodedPlanId: "AnnualMembership",
    comparePlansButtonLabel: "Action 1",
    isHighlighted: false,
    title: "Test 1",
  },
  {
    hardCodedPlanId: "LPMMembership",
    comparePlansButtonLabel: "Action 2",
    isHighlighted: true,
    title: "Test 2",
  },
  {
    hardCodedPlanId: "LPMPlusMembership",
    comparePlansButtonLabel: "Action 3",
    isHighlighted: false,
    title: "Test 3",
  },
];

const ROWS = [
  {
    label: "Label 1",
    title: "Title 1",
    availableColumns: [
      "LPMMembership",
      "LPMPlusMembership",
    ] satisfies MembershipPlanId[],
  },
  {
    label: "Label 2",
    title: "Title 2",
    availableColumns: ["AnnualMembership"] satisfies MembershipPlanId[],
  },
];
