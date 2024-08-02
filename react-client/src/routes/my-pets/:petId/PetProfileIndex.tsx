import { useState } from "react";
import {
  Button,
  Collapse,
  Title,
  Text,
  Icon,
  IconKeys,
  TextSpan,
  StyleProps,
} from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { PetCard } from "~/components/Pet/PetCard";
import { PetCardInfo } from "~/components/Pet/PetCardInfo";
import { usePetProfileContext } from "./usePetProfileLayoutViewModel";
import { LostPetUpdate, MissingStatus } from "~/mocks/MockRestApiServer";
import { PaginatedTable } from "~/components/design-system/table/paginatedTable/PaginatedTable";
import { classNames } from "~/util/styleUtil";

const columns = [
  { key: "id", width: "100px", label: "Case ID" },
  { key: "date", width: "200px", label: "Opened" },
  { key: "update", width: "200px", label: "Last Update" },
  { key: "status", width: "180px", label: "Status" },
  { key: "note", label: "Note" },
];

const ITEMS_PER_PAGE = 5;

export const PetProfileIndex = () => {
  const { petInfo } = usePetProfileContext();
  const tableRows = (() => {
    return petInfo.lostPetHistory ? petInfo.lostPetHistory.map(convertUpdateToRow) : [];
  })();

  const [isTableVisible, setIsTableVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(
    tableRows.slice(0, ITEMS_PER_PAGE)
  );

  return (
    <Layout>
      <Header
        pageTitle="Pet Profile"
        primaryElement={renderActionsButton()}
        shouldRenderBackButton
      />
      <PetCard
        classNames={{ root: "lg:flex" }}
        img={petInfo.img}
        name={petInfo.name}
        variant="lg"
      >
        <PetCardInfo {...petInfo} name={petInfo.name} />
      </PetCard>
      {renderLostPetUpdates()}
    </Layout>
  );

  function renderLostPetUpdates() {
    return (
      <div className="mt-large">
        <Collapse
          isOpen={isTableVisible}
          onOpenChange={setIsTableVisible}
          title={<Title level="h4">Lost Pets Status Update</Title>}
        >
          {renderDescriptionMessage()}
          <PaginatedTable
            columns={columns}
            rows={currentRows}
            currentPage={currentPage}
            didChangePagination={handlePagination}
            itemsCount={tableRows.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
          {renderReportButton()}
        </Collapse>
      </div>
    );
  }

  function renderDescriptionMessage() {
    return (
      <div className="mb-large">
        <Text size="base">
          {currentRows.length
            ? "Track your pet's status."
            : "Report Your pet as lost in case i goes missing."}
        </Text>
      </div>
    );
  }

  function convertUpdateToRow({
    date,
    update,
    status,
    id,
    note,
  }: LostPetUpdate) {
    return {
      data: {
        date: new Date(date).toLocaleString(),
        update: new Date(update).toLocaleString(),
        status: convertStatus(status),
        id,
        // eslint-disable-next-line no-extra-boolean-cast
        note: !!note ? note : "-",
      },
      key: `${id}-${date}`,
      isSelectable: false,
    };
  }

  function convertStatus(status: LostPetUpdate["status"]) {
    const { message, textColor, bgColor } = convertInfo(status);
    return (
      <div
        className={classNames("flex w-full justify-center rounded-md", bgColor)}
      >
        <TextSpan color={textColor}>{message}</TextSpan>
      </div>
    );
  }

  function renderReportButton() {
    const { icon, iconColor, message } = reportingVariables(
      petInfo.missingStatus ?? "found"
    );
    return (
      <Button variant="secondary" fullWidth>
        <Icon display={icon} className={`mr-base ${iconColor}`} /> {message}
      </Button>
    );
  }

  function handlePagination(page: number, itemsPerPage: number) {
    setCurrentPage(page);
    const offsetStartIndex = itemsPerPage * (page - 1);
    const offsetFinishIndex = offsetStartIndex + itemsPerPage;
    setCurrentRows(tableRows.slice(offsetStartIndex, offsetFinishIndex));
  }
};

function renderActionsButton() {
  return (
    <>
      <Button
        className="hidden lg:block"
        iconLeft="apps"
        variant="secondary"
        iconProps={{ className: "text-brand-secondary" }}
      >
        Actions
      </Button>
      <Button
        className="block lg:hidden"
        iconLeft="shieldGood"
        iconProps={{ className: "text-brand-secondary" }}
        variant="secondary"
      >
        Report lost pet
      </Button>
    </>
  );
}

function reportingVariables(status: MissingStatus) {
  return {
    missing: {
      icon: "checkCircle" as IconKeys,
      iconColor: "text-brand-main",
      message: "Report pet as found",
    },
    found: {
      icon: "warning" as IconKeys,
      iconColor: "text-yellow-300",
      message: "Report pet as missing",
    },
  }[status];
}

function convertInfo(status: MissingStatus) {
  return {
    missing: {
      bgColor: "bg-yellow-100",
      textColor: "yellow-500" as StyleProps["color"],
      message: "Reported missing",
    },
    found: {
      bgColor: "bg-green-100",
      textColor: "green-500" as StyleProps["color"],
      message: "I found my pet",
    },
  }[status];
}
