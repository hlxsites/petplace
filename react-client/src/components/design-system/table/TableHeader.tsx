import { useCallback } from "react";
import { Icon, IconKeys } from "../icon/Icon";
import { TextSpan } from "../text/TextSpan";
import { ITableHeaderProps } from "./TableTypes";
import { useCellBase } from "./useCellBase";

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
  const sortOrder = desc ? "descending" : "ascending";
  const sortedIcon = desc ? "sortDownS" : "sortUpS";
  const sortIcon = isSorted ? sortedIcon : "sortS";

  const children = (() => {
    const labelElement = <TextSpan>{column.label}</TextSpan>;

    if (!canBeSorted) return labelElement;

    return (
      <button
        className="gap-1 flex"
        onClick={onRequestSort(column.key as ColumnKey)}
        type="button"
      >
        {labelElement}
        <Icon data-testid={sortIcon} display={sortIcon as IconKeys} size={14} />
      </button>
    );
  })();
  return (
    <th
      aria-sort={isSorted ? sortOrder : undefined}
      colSpan={colSpan}
      data-testid="table_thead_th"
      className={className({ isHeader: true })}
      key={column.key}
      scope="col"
      style={{ textAlign: column.align ?? "left", width: column.minWidth }}
    >
      {children}
    </th>
  );
};
