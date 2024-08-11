import { render, within } from "@testing-library/react";
import type { ComponentProps } from "react";

import { TableHeader } from "./TableHeader";

const AGE_COLUMN = { key: "age", label: "Age" };
const EMAIL_COLUMN = { isSortable: true, key: "email", label: "Email" };
const NAME_COLUMN = { isSortable: true, key: "name", label: "Name" };

describe("<TableHeader />", () => {
  it.each([
    ["Name", NAME_COLUMN],
    ["Email", EMAIL_COLUMN],
    ["Age", AGE_COLUMN],
  ])("should display column '%s'", (label, column) => {
    const { getByRole } = getRenderer({ column });
    expect(getByRole("columnheader", { name: label })).toBeInTheDocument();
  });


  it.each([2, 5, 10])("should have colspan '%i'", (expected) => {
    const { getByRole } = getRenderer({ colSpan: expected });
    expect(getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "colspan",
      expected.toString()
    );
  });

  describe("with isSortable={true}", () => {
    it.each([
      ["Name", NAME_COLUMN],
      ["Email", EMAIL_COLUMN],
    ])(
      "with sortBy={null}, should display sort icon for '%s'",
      (label, column) => {
        const { getByRole } = getRenderer({
          column,
          desc: false,
          didSort: jest.fn(),
          sortBy: null,
        });
        expect(getByRole("columnheader", { name: label })).not.toHaveAttribute(
          "aria-sort"
        );
        expect(
          within(getByRole("button")).getByTestId("sortS")
        ).toBeInTheDocument();
      }
    );

    it.each([
      ["Name", NAME_COLUMN],
      ["Email", EMAIL_COLUMN],
    ])("should display sorted by '%s' ascending", (label, column) => {
      const { getByRole } = getRenderer({
        column,
        desc: false,
        didSort: jest.fn(),
        sortBy: column.key,
      });
      expect(getByRole("columnheader", { name: label })).toHaveAttribute(
        "aria-sort",
        "ascending"
      );
      expect(
        within(getByRole("button")).getByTestId("sortUpS")
      ).toBeInTheDocument();
    });

    it.each([
      ["Name", NAME_COLUMN],
      ["Email", EMAIL_COLUMN],
    ])("should display sorted by '%s' descending", (label, column) => {
      const { getByRole } = getRenderer({
        column,
        desc: true,
        didSort: jest.fn(),
        sortBy: column.key,
      });
      expect(getByRole("columnheader", { name: label })).toHaveAttribute(
        "aria-sort",
        "descending"
      );
      expect(
        within(getByRole("button")).getByTestId("sortDownS")
      ).toBeInTheDocument();
    });

    it.each([
      ["Name", NAME_COLUMN],
      ["Email", EMAIL_COLUMN],
    ])(
      "with sortBy={null}, should allow sortable column '%s' to be clicked and return false on desc param",
      (label, column) => {
        const didSort = jest.fn<
          string,
          Parameters<
            Exclude<ComponentProps<typeof TableHeader>["didSort"], undefined>
          >
        >();
        const { getByRole } = getRenderer({
          column,
          desc: false,
          didSort,
        });
        expect(didSort).not.toHaveBeenCalled();

        getByRole("button", { name: label }).click();
        const [key1, desc1] = didSort.mock.calls[0];
        expect(key1).toBe(column.key);
        expect(desc1).toBe(false);
        expect(didSort).toHaveBeenCalledTimes(1);
      }
    );

    it.each([
      ["Name", NAME_COLUMN],
      ["Email", EMAIL_COLUMN],
    ])(
      "sorted by '%s' and desc={true}, should allow column to be clicked and return null on key and true on desc param",
      (label, column) => {
        const didSort = jest.fn<
          string,
          Parameters<
            Exclude<ComponentProps<typeof TableHeader>["didSort"], undefined>
          >
        >();

        const { getByRole } = getRenderer({
          column,
          desc: true,
          didSort,
          sortBy: column.key,
        });

        getByRole("button", { name: label }).click();
        const [key, desc] = didSort.mock.calls[0];
        expect(key).toBe(null);
        expect(desc).toBe(true);
        expect(didSort).toHaveBeenCalledTimes(1);
      }
    );

    it.each([
      ["Name", NAME_COLUMN],
      ["Email", EMAIL_COLUMN],
    ])(
      "sorted by '%s' and desc={false}, should allow column to be clicked and return true on desc param",
      (label, column) => {
        const didSort = jest.fn<
          string,
          Parameters<
            Exclude<ComponentProps<typeof TableHeader>["didSort"], undefined>
          >
        >();
        const { getByRole } = getRenderer({
          column,
          desc: false,
          didSort,
          sortBy: column.key,
        });

        getByRole("button", { name: label }).click();
        const [key, desc] = didSort.mock.calls[0];
        expect(key).toBe(column.key);
        expect(desc).toBe(true);
        expect(didSort).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe("without isSortable={true}", () => {
    it("should NOT display sort icon", () => {
      const { getByRole, queryByTestId } = getRenderer({
        column: AGE_COLUMN,
        desc: false,
        didSort: jest.fn(),
        sortBy: "age",
      });
      expect(
        getByRole("columnheader", { name: AGE_COLUMN.label })
      ).not.toHaveAttribute("aria-sort");
      expect(queryByTestId("sortS")).not.toBeInTheDocument();
    });
  });
});

function getRenderer({
  colSpan,
  column,
  desc,
  sortBy,
  didSort = () => {
    /* */
  },
}: Partial<ComponentProps<typeof TableHeader>>) {
  return render(
    <table>
      <thead>
        <tr>
          <TableHeader
            colSpan={colSpan}
            column={column || NAME_COLUMN}
            desc={!!desc}
            didSort={didSort}
            sortBy={sortBy}
          />
        </tr>
      </thead>
    </table>
  );
}
