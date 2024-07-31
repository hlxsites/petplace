import { useCallback } from "react";
import { Conditional } from "../conditional/Conditional";
import { Icon, IconKeys } from "~/components/design-system";
import { useCellBase } from "./useCellBase";
import { ITableHeaderProps } from "../types/TableTypes";


export const TableHeader = <ColumnKey,>({
  colSpan = 1,
  column,
  desc,
  sortBy,
  didSort,
}: ITableHeaderProps<ColumnKey>) => {
  const onRequestSort = useCallback(
    (key: ColumnKey) => () => {
      if (!didSort) {
        return;
      }
      if (sortBy === key) {
        didSort(desc ? null : key, true);
      } else {
        didSort(key, false);
      }
    },
    [didSort, desc, sortBy]
  );
  const { className } = useCellBase();

  const canBeSorted = !!didSort && !!column.isSortable;
  const isSorted = canBeSorted && sortBy === column.key;
  const sortIcon = isSorted ? (desc ? "sortDownS" : "sortUpS") : "sortS";

  const headerLabel = <span className={column.className}>{column.label}</span>;

  return (
    <th
      aria-sort={isSorted ? (desc ? "descending" : "ascending") : undefined}
      colSpan={colSpan}
      data-testid="table_thead_th"
      className={className({ isHeader: true })}
      key={column.key}
      scope="col"
      style={{ textAlign: column.align || "left", width: column.width }}
    >
      <Conditional ifFalse={headerLabel} when={canBeSorted}>
        <button
          className="gap-1 flex"
          onClick={onRequestSort(column.key as ColumnKey)}
          type="button"
        >
          {headerLabel}
          <Icon
            data-testid={sortIcon}
            display={sortIcon as IconKeys}
            size={14}
          />
        </button>
      </Conditional>
    </th>
  );
};
