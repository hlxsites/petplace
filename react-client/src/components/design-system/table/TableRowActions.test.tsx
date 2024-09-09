import { render } from "@testing-library/react";
import type { ComponentProps } from "react";

import userEvent from "@testing-library/user-event";
import { TableRowActions } from "./TableRowActions";
import { RowAction } from "./TableTypes";

const DEFAULT_ACTIONS = [
  {
    icon: "check",
    id: "check-id",
    label: "Check",
  },
  {
    icon: "trash",
    id: "trash-id",
    label: "Trash",
  },
];

describe("<TableHeader />", () => {
  it("should render cell", () => {
    const { getByRole } = getRenderer({});
    expect(getByRole("cell")).toBeInTheDocument();
  });

  it("should render action buttons", () => {
    const { getAllByRole } = getRenderer({});
    expect(getAllByRole("button").length).toBe(DEFAULT_ACTIONS.length);
  });

  it.each(DEFAULT_ACTIONS)(
    "should call onSelect callback when clicked",
    async ({ label, id }) => {
      const onSelect = jest.fn();

      const { getByRole } = getRenderer({ onSelect });
      const actionButton = getByRole("button", { name: label });
      expect(onSelect).not.toHaveBeenCalled();

      await userEvent.click(actionButton);
      expect(onSelect).toHaveBeenCalledWith(id);
    }
  );

  it.each(DEFAULT_ACTIONS)("should display correct icon", ({ label }) => {
    const { getByRole } = getRenderer({});
    expect(
      getByRole("button", { name: label }).querySelector("svg")
    ).toHaveAttribute("data-file-name", `Svg${label}Icon`);
  });
});

type Props = ComponentProps<typeof TableRowActions>;

function getRenderer({
  onSelect = jest.fn(),
  rowActions = DEFAULT_ACTIONS as RowAction[],
}: Partial<Props>) {
  return render(
    <table>
      <tbody>
        <tr>
          <TableRowActions onSelect={onSelect} rowActions={rowActions} />
        </tr>
      </tbody>
    </table>
  );
}
