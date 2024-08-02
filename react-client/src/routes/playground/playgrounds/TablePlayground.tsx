import { Table, Title } from "~/components/design-system";
import { TableColumn } from "~/components/design-system/table/TableTypes";

const SimpleTable = () => {
  const columns: TableColumn[] = [
    { key: "date", width: "100px", label: "Date" },
    { key: "status", width: "200px", label: "Status" },
    { key: "id", width: "300px", label: "ID" },
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
    { key: "date", width: "100px" },
    { key: "status", width: "200px" },
    { key: "id", width: "300px" },
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
    </div>
  );
};
