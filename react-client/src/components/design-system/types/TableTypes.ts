import { ReactNode } from "react";
import { IconKeys } from "../icon/Icon";

export type ITableHeaderProps<ColumnKey> = {
  colSpan?: number;
  column: TableColumn;
  desc?: boolean;
  didSort?: (key: ColumnKey | null, desc: boolean) => void;
  sortBy?: string | null;
}

export type TableColumn = {
  align?: "left" | "center" | "right";
  className?: string;
  isSortable?: boolean;
  key: string;
  label?: ReactNode;
  width?: number | string;
}

export type TableRow<T> = {
  data: T;
  isSelected?: boolean;
  key: string;
}

export type RowAction = {
  icon: IconKeys;
  id: string;
  label: string;
}

export type TableCommonProps<T> = {
  ariaLabel?: string;
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
  wrapper?: (table: ReactNode) => ReactNode;
}

export type TableRowActionsProps = {
  onSelect: (actionId: RowAction["id"]) => void;
  rowActions?: RowAction[];
}

export type BulkSelectionAction = { label: string; onClick?: () => void };
