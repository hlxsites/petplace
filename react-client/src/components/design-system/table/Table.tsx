import { type ReactNode } from "react";
import { plural } from "~/util/stringUtils";
import { Button, Card, Checkbox, Loading } from "~/components/design-system";
import { Conditional } from "../conditional/Conditional";
import type { IconKeys } from "../icon/Icon";
import { TableHeader } from "./TableHeader";
import { TableRowActions } from "./TableRowActions";
import { classNames } from "~/util/styleUtil";
import { useCellBase } from "./useCellBase";

export interface TableColumn {
  align?: "left" | "center" | "right";
  className?: string;
  isSortable?: boolean;
  key: string;
  label?: ReactNode;
  width?: number | string;
}

export interface TableRow<T> {
  data: T;
  isSelected?: boolean;
  key: string;
}

export interface RowAction {
  icon: IconKeys;
  id: string;
  label: string;
}

export interface TableCommonProps<T> {
  bulkSelectionActions?: BulkSelectionAction[];
  columns: TableColumn[];
  desc?: boolean;
  didSelect?: (key: keyof T | "allOrNone") => void;
  didSelectRowAction?: (row: TableRow<T>, actionId: string) => void;
  didSort?: (key: keyof T | null, desc: boolean) => void;
  isLoading?: boolean;
  isSelectable?: boolean;
  noResultsMessage?: string;
  noResultsSearchTerm?: string;
  rowActions?: RowAction[];
  rows: TableRow<T>[];
  sortBy?: string | null;
  totalSelectedItems?: number;
}

export type BulkSelectionAction = { label: string; onClick?: () => void };

export const Table = <T,>({
  columns,
  desc = false,
  didSelect,
  didSort,
  isLoading = false,
  isSelectable = false,
  rowActions,
  rows,
  sortBy,
  noResultsMessage,
  noResultsSearchTerm,
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
  const isEmptyState = rows.length < 1;

  return (
    <>
      <Conditional when={isLoading}>
        <Loading />
      </Conditional>
      {renderNoResultsView()}
      <Conditional when={!isEmptyState && !isLoading}>
        {renderTableContent()}
      </Conditional>
    </>
  );

  function renderTableContent() {
    return (
      <div className="w-auto overflow-hidden py-large">
        <Card>
          <div className="scrolling-touch overflow-x-auto">
            <div className="w-full">{renderAsTable()}</div>
          </div>
        </Card>
      </div>
    );
  }

  function renderAsTable() {
    const tableColumns = getColumns();
    return (
      <table aria-label="table" className="min-w-full table-auto">
        <Conditional
          when={tableColumns.filter(({ label }) => !!label).length > 0}
        >
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
        </Conditional>
        <tbody>
          {rows.map((row, i) => {
            const isEven = i % 2 === 0;
            return (
              <tr
                className={classNames("hover table-row w-fit")}
                data-testid="table_tbody_tr"
                key={`row-${row.key}`}
              >
                <Conditional when={isSelectable}>
                  <td className={classNames(cellClassName({ isEven }))}>
                    <Checkbox
                      id={row.key}
                      label="Selecionar item"
                      checked={!!row.isSelected}
                      onCheckedChange={didSelectRow(row.key as keyof T)}
                    />
                  </td>
                </Conditional>
                {columns.map((column) => {
                  const data = row.data[column.key as keyof T];
                  let columnChild: unknown = data;

                  if (typeof data === "string") {
                    columnChild = <span className="inline-block">{data}</span>;
                  }

                  return (
                    <td
                      key={`${row.key}_${column.key}`}
                      className={cellClassName({ isEven })}
                      style={{
                        textAlign: column.align ?? "left",
                        minWidth: column.width,
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
    );
  }

  function getColumns(): TableColumn[] {
    const actionsColumn: TableColumn = {
      align: "right",
      key: "actionsColumn",
      label: "Ações",
      width: "5%",
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
            label="Selecionar todos os itens"
            onCheckedChange={didSelectRow("allOrNone")}
          />
        ),
        width: 24,
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
                one: "Um item selecionado",
                other: `${totalSelectedItems} items selecionados`,
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

  function renderNoResultsView() {
    if (!isEmptyState || isLoading) {
      return null;
    }

    const message = noResultsMessage ?? "Nenhum resultado encontrado para";
    return (
      <p>
        {message} <strong>{noResultsSearchTerm}</strong>
      </p>
    );
  }

  function onSelectRowAction(row: TableRow<T>) {
    return (actionId: RowAction["id"]) => {
      didSelectRowAction?.(row, actionId);
    };
  }
};
