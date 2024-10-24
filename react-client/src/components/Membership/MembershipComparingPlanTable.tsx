import { useEffect, useRef, useState } from "react";
import { MembershipInfo } from "~/domain/checkout/CheckoutModels";
import { Icon, Text, TextSpan, Title } from "../design-system";
import { MembershipComparingPlanLinkButton } from "./MembershipComparingPlanLinkButton";

type TableRow = {
  label: string;
  title: string;
  availableColumns: string[];
};

type Plan = Pick<
  MembershipInfo,
  | "comparePlansButtonLabel"
  | "hardCodedPlanId"
  | "id"
  | "isHighlighted"
  | "title"
>;

type MembershipComparingPlanTableProps = {
  plans: Plan[];
  rows: TableRow[];
};

export const MembershipComparingPlanTable = ({
  plans,
  rows,
}: MembershipComparingPlanTableProps) => {
  const [highlightStyles, setHighlightStyles] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const updateHighlightPosition = () => {
      if (tableRef.current) {
        const table = tableRef.current;
        const secondLastColumnIndex = plans.length - 1;
        const tableHeaderCells = table.querySelectorAll("th");

        if (tableHeaderCells.length > secondLastColumnIndex) {
          const targetCell = tableHeaderCells[secondLastColumnIndex];
          const tableRect = table.getBoundingClientRect();
          const targetCellRect = targetCell.getBoundingClientRect();

          setHighlightStyles({
            left: targetCellRect.left - tableRect.left,
            width: targetCellRect.width,
          });
        }
      }
    };

    updateHighlightPosition();
    window.addEventListener("resize", updateHighlightPosition);

    return () => window.removeEventListener("resize", updateHighlightPosition);
  }, [plans]);

  const actions: {
    id: string;
    hardCodedPlanId: string;
    isHighlighted?: boolean;
    label: string;
  }[] = [];
  const columns: { hardCodedPlanId: string; title: string }[] = [];

  plans.forEach(
    ({
      comparePlansButtonLabel,
      hardCodedPlanId,
      id,
      isHighlighted,
      title,
    }) => {
      actions.push({
        hardCodedPlanId,
        id,
        label: comparePlansButtonLabel,
        isHighlighted,
      });

      columns.push({ hardCodedPlanId, title });
    }
  );

  return (
    <div className="relative overflow-x-auto">
      {/* Highlight container */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border border-solid border-orange-300-contrast"
        style={{
          left: highlightStyles.left,
          width: highlightStyles.width,
          top: 0,
          bottom: 0,
          height: "100%",
        }}
      ></div>
      <table className="my-small w-full border-collapse" ref={tableRef}>
        <thead>
          <tr>
            <th>{/* Placeholder */}</th>
            {columns.map(({ hardCodedPlanId, title }) => (
              <th key={hardCodedPlanId}>
                <TextSpan fontFamily="raleway">{title}</TextSpan>
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
              {columns.map(({ hardCodedPlanId }, colIndex) => (
                <td
                  key={`${hardCodedPlanId}_icon_${colIndex}`}
                  className="relative text-center"
                >
                  {row.availableColumns.includes(hardCodedPlanId) ? (
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
          <tr>
            <td>{/* Placeholder */}</td>
            {actions.map((props) => (
              <td className="text-center" key={props.hardCodedPlanId}>
                <div className="space-x-4 flex justify-evenly pt-xlarge">
                  <MembershipComparingPlanLinkButton {...props} />
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
