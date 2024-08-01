import { IconButton } from "../button/IconButton";
import { RowAction, TableRowActionsProps } from "./TableTypes";

export const TableRowActions = ({
  onSelect,
  rowActions,
}: TableRowActionsProps) => {
  if (!rowActions || rowActions.length < 1) {
    return null;
  }
  return (
    <td style={{ textAlign: "right" }}>
      {rowActions.map(renderRowActionContent)}
    </td>
  );

  function renderRowActionContent({ icon, id, label }: RowAction) {
    return (
      <IconButton
        label={label}
        icon={icon}
        key={id}
        onClick={onClickAction(id)}
      />
    );
  }

  function onClickAction(actionId: RowAction["id"]) {
    return () => {
      onSelect(actionId);
    };
  }
};
