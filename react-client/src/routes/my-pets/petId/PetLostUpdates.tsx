import { useState } from "react";
import {
  Button,
  Collapse,
  Icon,
  IconKeys,
  Table,
  Text,
  TextSpan,
  Title,
} from "~/components/design-system";
import { TableColumn } from "~/components/design-system/table/TableTypes";
import { TextProps } from "~/components/design-system/types/TextTypes";
import {
  LostAndFountNotification,
  LostPetUpdateModel,
  MissingStatus,
} from "~/domain/models/pet/PetModel";
import { parseDate } from "~/util/dateUtils";
import { redirectToLostPet } from "~/util/forceRedirectUtil";
import { classNames } from "~/util/styleUtil";

type PetLostUpdatesSectionProps = {
  lostPetHistory: LostAndFountNotification[];
  missingStatus: MissingStatus;
  onClickReportPetFound: () => void;
};

const columns: TableColumn[] = [
  { key: "id", minWidth: "100px", label: "Case ID" },
  { key: "date", minWidth: "200px", label: "Opened" },
  { key: "update", minWidth: "200px", label: "Last Update" },
  { key: "status", minWidth: "180px", label: "Status" },
  { key: "note", minWidth: "300px", label: "Note" },
];

const ITEMS_PER_PAGE = 5;

export const PetLostUpdatesSection = ({
  lostPetHistory,
  missingStatus,
  onClickReportPetFound,
}: PetLostUpdatesSectionProps) => {
  const dataSource = (() => {
    return lostPetHistory ? lostPetHistory.map(convertUpdateToRow) : [];
  })();

  const isMissing = missingStatus === "missing";
  const [isOpen, setIsOpen] = useState(isMissing);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(
    dataSource.slice(0, ITEMS_PER_PAGE)
  );

  return (
    <Collapse
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={<Title level="h4">Lost Pets Status Update</Title>}
      isLocked={isMissing}
      padding="large"
    >
      {renderDescriptionMessage()}
      <Table
        columns={columns}
        rows={currentRows}
        paginationProps={{
          currentPage,
          didChangePage: handlePagination,
          itemsCount: dataSource.length,
          itemsPerPage: ITEMS_PER_PAGE,
        }}
      />
      {renderReportButton()}
    </Collapse>
  );

  function renderDescriptionMessage() {
    return (
      <div className="mb-large">
        <Text size="16">
          {currentRows.length
            ? "Track your pet's status."
            : "Report Your pet as lost in case i goes missing."}
        </Text>
      </div>
    );
  }

  function convertUpdateToRow(notification: LostAndFountNotification) {
    const {
      date,
      update,
      status,
      id,
      note,
    } = notification
    
    return {
      data: {
        date: parseDate(date),
        update: parseDate(update),
        status: convertStatus(status),
        id,
        note: note || "-",
      },
      key: JSON.stringify(notification),
      isSelectable: false,
    };
  }

  function convertStatus(status: LostPetUpdateModel["status"]) {
    const { message, textColor, bgColor } = convertStatusVariable(status);
    return (
      <div
        className={classNames("flex w-full justify-center rounded-md", bgColor)}
      >
        <TextSpan color={textColor}>{message}</TextSpan>
      </div>
    );
  }

  function renderReportButton() {
    const { icon, iconColor, message, onClick } = reportingVariables(
      missingStatus ?? "found"
    );
    return (
      <Button variant="secondary" onClick={onClick} fullWidth>
        <Icon display={icon} className={`mr-base ${iconColor}`} /> {message}
      </Button>
    );
  }

  function handlePagination(page: number, itemsPerPage: number) {
    setCurrentPage(page);
    const offsetStartIndex = itemsPerPage * (page - 1);
    const offsetFinishIndex = offsetStartIndex + itemsPerPage;
    setCurrentRows(dataSource.slice(offsetStartIndex, offsetFinishIndex));
  }

  function reportingVariables(status: MissingStatus) {
    type ReportVariable = Record<
      MissingStatus,
      {
        icon: IconKeys;
        iconColor: string;
        message: string;
        onClick: () => void;
      }
    >;

    return (
      {
        missing: {
          icon: "checkCircle",
          iconColor: "text-brand-main",
          message: "Report pet as found",
          onClick: onClickReportPetFound,
        },
        found: {
          icon: "warning",
          iconColor: "text-yellow-300",
          message: "Report pet as missing",
          onClick: redirectToLostPet,
        },
      } satisfies ReportVariable
    )[status];
  }
};

function convertStatusVariable(status: MissingStatus) {
  type ConvertVariable = Record<
    MissingStatus,
    { textColor: TextProps["color"]; bgColor: string; message: string }
  >;

  return (
    {
      missing: {
        bgColor: "bg-yellow-100",
        textColor: "yellow-500",
        message: "Reported missing",
      },
      found: {
        bgColor: "bg-green-100",
        textColor: "green-500",
        message: "I found my pet",
      },
    } satisfies ConvertVariable
  )[status];
}
