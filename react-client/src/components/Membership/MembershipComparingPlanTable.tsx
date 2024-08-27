import { Button, Icon, Text, TextSpan, Title } from "../design-system";
import { MembershipPlans, TableActions } from "./types/MembershipTypes";

type TableRow = {
  label: string;
  title: string;
  availableColumns: MembershipPlans[];
};

type MembershipComparingPlanTableProps = {
  actions: TableActions[];
  rows: TableRow[];
  columns: MembershipPlans[];
};

export const MembershipComparingPlanTable = ({
  actions,
  columns,
  rows,
}: MembershipComparingPlanTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th>{/* Placeholder */}</th>
            {columns.map((column) => (
              <th key={column}>
                <TextSpan fontFamily="raleway">{column}</TextSpan>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.title} className="relative">
              <td className="px-base py-base">
                <Title level="h5">{row.title}</Title>
                <Text>{row.label}</Text>
                {/* Neutral border container */}
                <div className="pointer-events-none absolute inset-0 my-small rounded-2xl border border-solid border-neutral-300"></div>
              </td>
              {columns.map((column, colIndex) => (
                <td
                  key={`${column} icon ${colIndex}`}
                  className="relative text-center"
                >
                  {row.availableColumns.includes(column as MembershipPlans) ? (
                    <Icon
                      className="text-green-300"
                      display="checkCircle"
                      size={24}
                    />
                  ) : (
                    <Icon
                      className="text-red-300"
                      display="clearCircle"
                      size={24}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className="">
            <td>{/* Placeholder */}</td>
            {actions.map(({ label, ...rest }) => (
              <td key={label}>
                <Button {...rest}>{label}</Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
