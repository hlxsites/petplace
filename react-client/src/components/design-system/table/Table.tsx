import { type ReactNode } from "react";
import { plural } from "~/util/stringUtil";
import { classNames } from "~/util/styleUtil";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Checkbox } from "../checkbox/Checkbox";
import { Loading } from "../loading/Loading";
import { ControlledPagination } from "../pagination/ControlledPagination";
import { TableHeader } from "./TableHeader";
import { TableRowActions } from "./TableRowActions";
import {
  RowAction,
  TableColumn,
  TableCommonProps,
  TableRow,
} from "./TableTypes";
import { useCellBase } from "./useCellBase";

export const Table = <T,>({
  ariaLabel,
  columns,
  desc = false,
  didSelect,
  didSort,
  isLoading = false,
  isSelectable = false,
  paginationProps,
  rowActions,
  rows,
  sortBy,
  bulkSelectionActions,
  totalSelectedItems = 0,
  didSelectRowAction,
}: TableCommonProps<T>) => {
  const isThereAnyRowAction = (rowActions?.length ?? 0) > 0;
  const { className: cellClassName } = useCellBase();

  const didSelectRow = (key: keyof T | "allOrNone") => {
    return () => {
      didSelect?.(key);
    };
  };

  const hasAnythingSelected = totalSelectedItems > 0;

  if (isLoading) return <Loading />;

  // TODO: add a empty state content here
  if (!rows.length) return null;

  return (() => (
    <div className="w-auto overflow-hidden py-large">
      <Card>
        <div className="scrolling-touch overflow-x-auto">
          <div className="w-full">{renderTableContent()}</div>
        </div>
      </Card>
    </div>
  ))();

  function renderTableContent() {
    const tableColumns = getColumns();

    const tableHeader = (() => {
      if (tableColumns.every(({ label }) => !label)) return null;

      return (
        <thead>
          <tr>
            {tableColumns.map((column) => {
              return (
                <TableHeader<keyof T>
                  colSpan={
                    column.key === "bulkSelectionHeader" ? columns.length : 1
                  }
                  column={column}
                  desc={desc}
                  didSort={didSort}
                  key={column.key}
                  sortBy={sortBy}
                />
              );
            })}
          </tr>
        </thead>
      );
    })();

    const pagination = (() => {
      if (!paginationProps) return null;

      return (
        <div className="flex w-full">
          <ControlledPagination {...paginationProps} />
        </div>
      );
    })();

    return (
      <>
        <div className="overflow-x-auto">
          <div>
            <table aria-label={ariaLabel} className="min-w-full table-auto">
              {tableHeader}
              <tbody>
                {rows.map((row, i) => {
                  const isEven = i % 2 === 0;

                  const selectedTableItem = (() => {
                    if (!isSelectable) return null;
                    return (
                      <td className={classNames(cellClassName({ isEven }))}>
                        <Checkbox
                          id={row.key}
                          label="Select item"
                          checked={!!row.isSelected}
                          onCheckedChange={didSelectRow(row.key as keyof T)}
                        />
                      </td>
                    );
                  })();

                  return (
                    <tr
                      className={classNames("hover table-row w-fit")}
                      data-testid="table_tbody_tr"
                      key={`row-${row.key}`}
                    >
                      {selectedTableItem}
                      {columns.map((column) => {
                        const data = row.data[column.key as keyof T];
                        let columnChild: unknown = data;

                        if (typeof data === "string") {
                          columnChild = (
                            <span className="inline-block">{data}</span>
                          );
                        }

                        return (
                          <td
                            key={`${row.key}_${column.key}`}
                            className={cellClassName({ isEven })}
                            style={{
                              textAlign: column.align ?? "left",
                              minWidth: column.minWidth,
                            }}
                          >
                            {columnChild as ReactNode}
                          </td>
                        );
                      })}
                      <TableRowActions
                        onSelect={onSelectRowAction(row)}
                        rowActions={rowActions}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {pagination}
      </>
    );
  }

  function getColumns(): TableColumn[] {
    const actionsColumn: TableColumn = {
      align: "right",
      key: "actionsColumn",
      label: "Actions",
      minWidth: "5%",
    };

    let columnsList: TableColumn[] = [];

    if (isSelectable && didSelect) {
      const isAllSelected = totalSelectedItems === rows.length;

      columnsList.push({
        key: "inputCheckbox",
        label: (
          <Checkbox
            checked={isAllSelected}
            hideLabel
            id="select-all"
            label="Select all items"
            onCheckedChange={didSelectRow("allOrNone")}
          />
        ),
        minWidth: 24,
      });
    }

    if (hasAnythingSelected) {
      columnsList.push({
        align: "left",
        key: "bulkSelectionHeader",
        label: (
          <>
            <span
              style={{
                marginRight: 16,
              }}
            >
              {plural({
                countFrom: totalSelectedItems,
                one: "One selected item",
                other: `${totalSelectedItems} selected items`,
              })}
            </span>
            {bulkSelectionActions?.map(({ label, onClick }) => (
              <Button key={label} onClick={onClick} variant="secondary">
                {label}
              </Button>
            ))}
          </>
        ),
      });
    } else {
      columnsList = [...columnsList, ...columns];
    }

    if (isThereAnyRowAction) {
      return [...columnsList, actionsColumn];
    }
    return columnsList;
  }

  function onSelectRowAction(row: TableRow<T>) {
    return (actionId: RowAction["id"]) => {
      didSelectRowAction?.(row, actionId);
    };
  }
};
