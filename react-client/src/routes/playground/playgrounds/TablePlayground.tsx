import { useState } from "react";
import { Table, Title } from "~/components/design-system";
import { TableColumn } from "~/components/design-system/table/TableTypes";

const SimpleTable = () => {
  const columns: TableColumn[] = [
    { key: "date", minWidth: "100px", label: "Date" },
    { key: "status", minWidth: "200px", label: "Status" },
    { key: "id", minWidth: "300px", label: "ID" },
    { key: "note", label: "Note" },
  ];

  const rows = [
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "1",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "2",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "3",
      isSelectable: false,
    },
  ];

  return (
    <div className="">
      <Table columns={columns} rows={rows} />
    </div>
  );
};

const TableWithoutHeader = () => {
  const columns: TableColumn[] = [
    { key: "date", minWidth: "100px" },
    { key: "status", minWidth: "200px" },
    { key: "id", minWidth: "300px" },
    { key: "note" },
  ];

  const rows = [
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "1",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "2",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "3",
      isSelectable: false,
    },
  ];

  return (
    <div className="">
      <Table columns={columns} rows={rows} />
    </div>
  );
};

const TableWithPages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(
    getPaginatedRows().slice(0, 5)
  );
  const pageColumns = [
    { key: "date", minWidth: "150px", label: "Date" },
    { key: "status", minWidth: "250px", label: "Status" },
    { key: "id", minWidth: "350px", label: "ID" },
    { key: "note", label: "Note" },
  ];

  return (
    <div className="">
      {/* <Table columns={columns} rows={rows} /> */}
      <Table
        columns={pageColumns}
        rows={currentRows}
        paginationProps={{
          currentPage: currentPage,
          didChangePage: (page: number, itemsPerPage: number) => {
            setCurrentPage(page);
            const offsetStartIndex = itemsPerPage * (page - 1);
            const offsetFinishIndex = offsetStartIndex + itemsPerPage;
            setCurrentRows(
              getPaginatedRows().slice(offsetStartIndex, offsetFinishIndex)
            );
          },
          itemsCount: getPaginatedRows().length,
          itemsPerPage: 5,
        }}
      />
    </div>
  );
};

export const TablePlayground = () => {
  return (
    <div className="flex flex-col gap-xlarge">
      <div>
        <Title level="h2">Simple table</Title>
        <SimpleTable />
      </div>
      <div>
        <Title level="h2">Table without header</Title>
        <TableWithoutHeader />
      </div>
      <div>
        <Title level="h2">Table with pages</Title>
        <TableWithPages />
      </div>
    </div>
  );
};

function getPaginatedRows() {
  return [
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner1",
      },
      key: "1",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "2",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "3",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "4",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "5",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "6",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "11",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "12",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "13",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "21",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "22",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "23",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "31",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "32",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "33",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "41",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "42",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "43",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "61",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "52",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "53",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "51",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "62",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "63",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "71",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "72",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "73",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "81",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "82",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "83",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "91",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "92",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "93",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "101",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "102",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "103",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "111",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "112",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "113",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "121",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "122",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "123",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "131",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "132",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "133",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "141",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "142",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "143",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "151",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "152",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "153",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "161",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "162",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "163",
      isSelectable: false,
    },
    {
      data: {
        date: "17/04/2023",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner",
      },
      key: "171",
      isSelectable: false,
    },
    {
      data: {
        date: "11/11/2012",
        status: "Found Pet",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Rescued by stranger",
      },
      key: "172",
      isSelectable: false,
    },
    {
      data: {
        date: "31/08/2024",
        status: "Reported Missing",
        id: "87428473698273hghw3874928472hwek3y2",
        note: "Informed by owner fim2",
      },
      key: "173",
      isSelectable: false,
    },
  ];
}
