import { render, screen } from "@testing-library/react";
import { MembershipComparingPlanTable } from "./MembershipComparingPlanTable";
import { MembershipPlans, TableActions } from "./types/MembershipTypes";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

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

    for (const { label } of ACTIONS) {
      const button = getByText(label);
      expect(button).toBeInTheDocument();
      expect(onClick).not.toHaveBeenCalled();

      await userEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
      onClick.mockClear();
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
  { label: "Action 1", variant: "secondary" },
  { label: "Action 2" },
];
const COLUMNS: MembershipPlans[] = [
  "Annual Protection",
  "Lifetime",
  "Lifetime Plus",
];
const ROWS = [
  {
    label: "Label 1",
    title: "Title 1",
    availableColumns: ["Lifetime", "Lifetime Plus"] as MembershipPlans[],
  },
  {
    label: "Label 2",
    title: "Title 2",
    availableColumns: ["Annual Protection"] as MembershipPlans[],
  },
];