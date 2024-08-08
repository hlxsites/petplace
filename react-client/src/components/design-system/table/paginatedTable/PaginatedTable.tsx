
import { ControlledPagination } from "../../pagination/ControlledPagination";
import { TableCommonProps } from "../TableTypes";
import { Table } from "../Table";

export interface IPaginatedTableCommonProps {
  currentPage: number;
  didChangePagination: (page: number, itemsPerPage: number) => void;
  itemsCount: number;
  itemsPerPage: number;
}

export type PaginatedTableProps<T> = IPaginatedTableCommonProps &
  TableCommonProps<T>;

export const PaginatedTable = <T,>({
  currentPage,
  itemsCount,
  itemsPerPage,
  didChangePagination,
  ...rest
}: PaginatedTableProps<T>) => {
  return (
    <Table
      wrapper={(child) => (
        <ControlledPagination
          currentPage={currentPage}
          className="w-auto overflow-hidden"
          itemsCount={itemsCount}
          itemsPerPage={itemsPerPage}
          onChange={didChangePagination}
        >
          {child}
        </ControlledPagination>
      )}
      {...rest}
    />
  );
};
