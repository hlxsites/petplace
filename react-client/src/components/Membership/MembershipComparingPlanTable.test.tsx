import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MembershipPlan, TableActions } from "~/domain/checkout/CheckoutModels";
import { MembershipComparingPlanTable } from "./MembershipComparingPlanTable";

const { getAllByRole, getByText } = screen;

describe("MembershipComparingPlanTable", () => {
  it("should render the table with columns and rows", () => {
    getRenderer();

    // Verify columns are rendered
    COLUMNS.forEach((column) => {
      expect(getByText(column)).toBeInTheDocument();
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
    for (const { label } of ACTIONS) {
      const button = getByText(label);
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

function getRenderer({
  actions = ACTIONS,
  columns = COLUMNS,
  onClick,
  rows = ROWS,
}: Partial<ComponentProps<typeof MembershipComparingPlanTable>> = {}) {
  return render(
    <MembershipComparingPlanTable
      actions={actions}
      columns={columns}
      onClick={onClick}
      rows={rows}
    />
  );
}

// Mock data
const ACTIONS: TableActions[] = [
  { label: "Action 1" },
  { label: "Action 2", isPrimary: true },
];
const COLUMNS: MembershipPlan[] = [
  "Annual Protection",
  "Lifetime",
  "Lifetime Plus",
];
const ROWS = [
  {
    label: "Label 1",
    title: "Title 1",
    availableColumns: ["Lifetime", "Lifetime Plus"] as MembershipPlan[],
  },
  {
    label: "Label 2",
    title: "Title 2",
    availableColumns: ["Annual Protection"] as MembershipPlan[],
  },
];
