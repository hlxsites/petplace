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
import {
  LostAndFountNotification,
  MissingStatus,
} from "~/domain/models/pet/PetModel";
import { parseDate } from "~/util/dateUtils";
import { redirectToLostPet } from "~/util/forceRedirectUtil";
import { classNames } from "~/util/styleUtil";

type PetLostUpdatesSectionProps = {
  lostPetHistory: LostAndFountNotification[];
  missingStatus?: MissingStatus;
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
  const dataSource = lostPetHistory.map(convertUpdateToRow);

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
    const { date, update, id, note } = notification;

    return {
      data: {
        date: parseDate(date),
        update: parseDate(update),
        status: convertStatus(notification),
        id,
        note: note || "-",
      },
      key: `${id}_${update}`,
      isSelectable: false,
    };
  }

  function convertStatus({
    status,
    statusMessage,
  }: Pick<LostAndFountNotification, "status" | "statusMessage">) {
    const isMissing = status === "missing";

    const bgColor = isMissing ? "bg-yellow-100" : "bg-green-100";
    const textColor = isMissing ? "yellow-500" : "green-500";

    return (
      <div
        className={classNames(
          "flex w-full justify-center rounded-md p-xsmall",
          bgColor
        )}
      >
        <TextSpan color={textColor}>{statusMessage}</TextSpan>
      </div>
    );
  }

  function renderReportButton() {
    const { icon, iconColor, message, onClick } =
      reportingVariables(missingStatus);
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

  function reportingVariables(status?: MissingStatus): {
    icon: IconKeys;
    iconColor: string;
    message: string;
    onClick: () => void;
  } {
    if (status === "missing") {
      return {
        icon: "checkCircle",
        iconColor: "text-brand-main",
        message: "Report pet as found",
        onClick: onClickReportPetFound,
      };
    }

    return {
      icon: "warning",
      iconColor: "text-yellow-300",
      message: "Report pet as missing",
      onClick: redirectToLostPet,
    };
  }
};
