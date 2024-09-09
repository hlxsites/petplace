import { within } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockNamesList } from "~/mocks/mockNames";
import { Table } from "./Table";
import type { TableCommonProps, TableRow } from "./TableTypes";

const {
  getAllByRole,
  getAllByTestId,
  getByRole,
  getByLabelText,
  getByTestId,
  getByText,
  queryByLabelText,
  queryByRole,
  queryByTestId,
  queryByText,
} = screen;

const NO_RESULTS_MESSAGE = "No results were found";

const SELECT_ALL_CHECKBOX = /^select all items$/i;
const SELECT_ITEM_CHECKBOX = /^select item$/i;

const NAME_COLUMN = /^name$/i;
const AGE_COLUMN = /^age$/i;
const EMAIL_COLUMN = /^email$/i;

const DEFAULT_LABEL = "test-table";

describe("<Table />", () => {
  const testRows = createRows(6);

  describe("with isLoading={true}", () => {
    it("should display LoadingView", () => {
      const { container } = getRenderer({
        isLoading: true,
        rows: createRows(2),
      });
      const spinner = container.querySelector("svg");
      expect(spinner).toHaveAttribute("name", "loadingIcon");
      expect(spinner).toBeInTheDocument();
    });

    it("should NOT display <table>", () => {
      getRenderer({
        isLoading: true,
        rows: createRows(2),
      });
      expect(queryByLabelText("table")).not.toBeInTheDocument();
    });

    it("should NOT display NoResultsView", () => {
      getRenderer({ isLoading: true, rows: [] });
      expect(queryByText(NO_RESULTS_MESSAGE)).not.toBeInTheDocument();
    });
  });

  describe("with isLoading={false}", () => {
    it("should NOT display LoadingView", () => {
      const { container } = getRenderer({
        isLoading: false,
        rows: createRows(2),
      });
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    describe("with rows", () => {
      it("should NOT display NoResultsView", () => {
        getRenderer({
          isLoading: false,
          rows: createRows(2),
        });
        expect(queryByText(NO_RESULTS_MESSAGE)).not.toBeInTheDocument();
      });

      it("should display <table>", () => {
        getRenderer({
          isLoading: false,
          rows: createRows(2),
        });
        expect(getByLabelText(DEFAULT_LABEL)).toBeInTheDocument();
      });

      it("should display Columns", () => {
        getRenderer({
          rows: createRows(5),
        });
        expect(
          getByRole("columnheader", { name: NAME_COLUMN })
        ).toBeInTheDocument();
        expect(
          getByRole("columnheader", { name: AGE_COLUMN })
        ).toBeInTheDocument();
        expect(
          getByRole("columnheader", { name: EMAIL_COLUMN })
        ).toBeInTheDocument();
        expect(getAllByRole("columnheader")).toHaveLength(3);
      });

      it("should NOT display Columns", () => {
        getRenderer({
          columns: [],
          rows: createRows(4),
        });
        expect(queryByRole("columnheader")).not.toBeInTheDocument();
        expect(queryByTestId("table_thead_th")).not.toBeInTheDocument();
      });

      it("should NOT display Columns with empty or undefined label", () => {
        getRenderer({
          columns: [
            { isSortable: true, key: "name", label: undefined },
            { isSortable: true, key: "email", label: "" },
          ],
          rows: createRows(4),
        });
        expect(queryByRole("columnheader")).not.toBeInTheDocument();
        expect(queryByTestId("table_thead_th")).not.toBeInTheDocument();
      });

      it.each(testRows.map(({ data }) => [data.name, data.age]))(
        "with multiple rows should display name '%s' and age '%s'",
        (name: string, age: string) => {
          getRenderer({ rows: testRows });
          const row = within(getByRole("table")).getByText(name).closest("tr");
          if (!row) {
            throw new Error("Row is missing");
          }
          const tr = within(row);
          expect(tr.getByText(name)).toBeInTheDocument();
          expect(tr.getByText(age)).toBeInTheDocument();
        }
      );

      it.each([10, 20, 50, 100])("should have %i rows", (expected) => {
        getRenderer({
          rows: createRows(expected),
        });
        expect(getAllByTestId("table_tbody_tr")).toHaveLength(expected);
      });

      describe("with isSelectable={false}", () => {
        it("should NOT display Checkbox", () => {
          const { baseElement } = getRenderer({
            isSelectable: false,
            rows: createRows(20),
          });
          expect(queryCheckboxColumn(baseElement)).toBeFalsy();
          expect(
            queryByRole("checkbox", {
              name: SELECT_ITEM_CHECKBOX,
            })
          ).not.toBeInTheDocument();
        });
      });

      describe("with isSelectable={true}", () => {
        it.each([6, 15, 20])("should display Checkbox %i times", (expected) => {
          getRenderer({
            didSelect: jest.fn(),
            isSelectable: true,
            rows: createRows(expected),
          });
          expect(
            getAllByRole("checkbox", { name: SELECT_ITEM_CHECKBOX })
          ).toHaveLength(expected);
        });

        it("should display default Columns with totalSelectedItems = 0", () => {
          const { baseElement } = getRenderer({
            didSelect: jest.fn(),
            isSelectable: true,
            rows: createRows(20),
            totalSelectedItems: 0,
          });
          expect(
            getByRole("columnheader", { name: NAME_COLUMN })
          ).toBeInTheDocument();

          expect(queryCheckboxColumn(baseElement)).toBeTruthy();
          expect(getAllByRole("columnheader")).toHaveLength(4);
        });

        it("should NOT display default Columns with totalSelectedItems bigger than 0", () => {
          const { baseElement } = getRenderer({
            didSelect: jest.fn(),
            isSelectable: true,
            rows: createRows(20),
            totalSelectedItems: 1,
          });
          expect(
            queryByRole("columnheader", { name: NAME_COLUMN })
          ).not.toBeInTheDocument();
          expect(queryCheckboxColumn(baseElement)).toBeTruthy();
          expect(getAllByRole("columnheader")).toHaveLength(2);
        });

        it("should display one selected item", () => {
          getRenderer({
            didSelect: jest.fn(),
            isSelectable: true,
            rows: createRows(20),
            totalSelectedItems: 1,
          });
          expect(getByText(/one selected item/i)).toBeInTheDocument();
        });

        it.each([2, 15])("should display '%i items selected'", (expected) => {
          getRenderer({
            didSelect: jest.fn(),
            isSelectable: true,
            rows: createRows(20),
            totalSelectedItems: expected,
          });
          expect(getByText(`${expected} selected items`)).toBeInTheDocument();
        });

        it("should NOT display bulk selection actions when totalSelectedItems = 0", () => {
          getRenderer({
            bulkSelectionActions: [
              {
                label: "Add Note",
                onClick: jest.fn(),
              },
              {
                label: "Send E-mail",
                onClick: jest.fn(),
              },
            ],
            isSelectable: true,
            rows: createRows(20),
            totalSelectedItems: 0,
          });
          expect(
            queryByRole("button", { name: "Add Note" })
          ).not.toBeInTheDocument();
          expect(
            queryByRole("button", { name: "Send E-mail" })
          ).not.toBeInTheDocument();
        });

        it("should display bulk selection actions and allow to use it when at least one item is selected", async () => {
          const onClickCallback = jest.fn();

          getRenderer({
            bulkSelectionActions: [
              {
                label: "Add Note",
                onClick: onClickCallback,
              },
              {
                label: "Send E-mail",
                onClick: onClickCallback,
              },
            ],
            isSelectable: true,
            rows: createRows(20),
            totalSelectedItems: 1,
          });
          const addNoteButton = getByRole("button", {
            name: "Add Note",
          });
          const sendEmailButton = getByRole("button", {
            name: "Send E-mail",
          });

          expect(addNoteButton).toBeInTheDocument();
          expect(sendEmailButton).toBeInTheDocument();
          expect(onClickCallback).not.toHaveBeenCalled();

          await userEvent.click(addNoteButton);
          expect(onClickCallback).toHaveBeenCalledTimes(1);

          await userEvent.click(sendEmailButton);
          expect(onClickCallback).toHaveBeenCalledTimes(2);
        });

        it("when user clicks on select all checkbox should call didSelect callback with correct key", async () => {
          const didSelect = jest.fn();

          getRenderer({
            didSelect,
            isSelectable: true,
            rows: testRows,
          });
          expect(didSelect).not.toHaveBeenCalled();

          await userEvent.click(
            getByRole("checkbox", { name: SELECT_ALL_CHECKBOX })
          );
          expect(didSelect).toHaveBeenCalledTimes(1);
          expect(didSelect).toHaveBeenCalledWith("allOrNone");
        });

        it.each([0, 2, 5])(
          "when user clicks on checkbox index %i should call didSelect callback with %i key",
          async (checkboxIndex) => {
            const didSelect = jest.fn();

            getRenderer({
              didSelect,
              isSelectable: true,
              rows: testRows,
            });
            expect(didSelect).not.toHaveBeenCalled();

            await userEvent.click(
              getAllByRole("checkbox", { name: SELECT_ITEM_CHECKBOX })[
                checkboxIndex
              ]
            );

            expect(didSelect).toHaveBeenCalled();
            expect(didSelect).toHaveBeenCalledWith(testRows[checkboxIndex].key);
          }
        );
      });

      describe("rowActions", () => {
        it("should NOT display 'actionColumn' when no rowActions are provided", () => {
          getRenderer({
            rowActions: [],
            rows: createRows(5),
          });
          expect(
            queryByRole("columnheader", { name: "Actions" })
          ).not.toBeInTheDocument();
        });

        it("should display 'actionColumn' when at least one rowActions are provided", () => {
          getRenderer({
            rowActions: [{ icon: "check", id: "add-note", label: "Add Note" }],
            rows: createRows(5),
          });
          expect(
            getByRole("columnheader", { name: "Actions" })
          ).toBeInTheDocument();
        });
      });

      describe("sorting feature", () => {
        it("should NOT display sorted icon if didSort isn't defined", () => {
          getRenderer({
            rows: createRows(5),
            sortBy: "name",
          });
          expect(
            getByRole("columnheader", { name: NAME_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: AGE_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: EMAIL_COLUMN })
          ).not.toHaveAttribute("aria-sort");

          expect(queryByTestId("sortS")).not.toBeInTheDocument();
        });

        it("should display that table can be sorted if didSort is defined but sortBy isn't", () => {
          getRenderer({
            didSort: jest.fn(),
            rows: createRows(5),
          });
          expect(
            getByRole("columnheader", { name: NAME_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: AGE_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: EMAIL_COLUMN })
          ).not.toHaveAttribute("aria-sort");

          expect(getAllByTestId("sortS")).toHaveLength(2);
        });

        it("should display sorted by 'name' ascending", () => {
          getRenderer({
            desc: false,
            didSort: jest.fn(),
            rows: createRows(5),
            sortBy: "name",
          });
          expect(
            getByRole("columnheader", { name: NAME_COLUMN })
          ).toHaveAttribute("aria-sort", "ascending");
          expect(
            getByRole("columnheader", { name: AGE_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: EMAIL_COLUMN })
          ).not.toHaveAttribute("aria-sort");

          expect(getByTestId("sortUpS")).toBeInTheDocument();
          expect(getByTestId("sortS")).toBeInTheDocument();
        });

        it("should display sorted by 'email' ascending", () => {
          getRenderer({
            desc: false,
            didSort: jest.fn(),
            rows: createRows(5),
            sortBy: "email",
          });
          expect(
            getByRole("columnheader", { name: NAME_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: AGE_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: EMAIL_COLUMN })
          ).toHaveAttribute("aria-sort", "ascending");

          expect(getByTestId("sortUpS")).toBeInTheDocument();
          expect(getByTestId("sortS")).toBeInTheDocument();
        });

        it("should display sorted by 'name' descending", () => {
          getRenderer({
            desc: true,
            didSort: jest.fn(),
            rows: createRows(5),
            sortBy: "name",
          });
          expect(
            getByRole("columnheader", { name: NAME_COLUMN })
          ).toHaveAttribute("aria-sort", "descending");
          expect(
            getByRole("columnheader", { name: AGE_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: EMAIL_COLUMN })
          ).not.toHaveAttribute("aria-sort");

          expect(getByTestId("sortDownS")).toBeInTheDocument();
          expect(getByTestId("sortS")).toBeInTheDocument();
        });

        it("should display sorted by 'email' descending", () => {
          getRenderer({
            desc: true,
            didSort: jest.fn(),
            rows: createRows(5),
            sortBy: "email",
          });
          expect(
            getByRole("columnheader", { name: NAME_COLUMN })
          ).not.toHaveAttribute("aria-sort");
          expect(
            getByRole("columnheader", { name: EMAIL_COLUMN })
          ).toHaveAttribute("aria-sort", "descending");

          expect(getByTestId("sortDownS")).toBeInTheDocument();
          expect(getByTestId("sortS")).toBeInTheDocument();
        });
      });
    });

    describe("without rows", () => {
      it("should NOT display <table>", () => {
        getRenderer({
          isLoading: false,
          rows: [],
        });
        expect(queryByLabelText("table")).not.toBeInTheDocument();
      });
    });
  });
});

type TableObject = {
  age: string;
  email?: string;
  name: string;
};

type Props = TableCommonProps<TableObject>;

function getRenderer({
  ariaLabel = DEFAULT_LABEL,
  columns,
  rows = [],
  ...rest
}: Partial<Props>) {
  return render(
    <Table<TableObject>
      columns={columns || defaultTestColumns()}
      rows={rows}
      ariaLabel={ariaLabel}
      {...rest}
    />
  );
}

function defaultTestColumns() {
  return [
    { isSortable: true, key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { isSortable: true, key: "email", label: "Email" },
  ];
}

function createRows(count: number): TableRow<TableObject>[] {
  const result: TableRow<TableObject>[] = [];
  for (let index = 0; index < count; index++) {
    result.push(createRow(index, mockNamesList[index], `${index + 10}`));
  }
  return result;

  function createRow(
    key: number,
    name: string,
    age: string
  ): TableRow<TableObject> {
    return {
      data: {
        age,
        email: key % 2 === 0 ? `${name}@email.com` : undefined,
        name,
      },
      key: `${key}`,
    };
  }
}

function queryCheckboxColumn(baseElement: Element) {
  return baseElement.querySelector('th button[role="checkbox"]');
}
