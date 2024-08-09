import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { ControlledPagination } from "./ControlledPagination";
import { findByTextContent } from "~/util/testingFunctions";

const { getByLabelText, getByRole, queryByLabelText, queryByRole } = screen;

const FIRST_PAGE = /^go to first page$/i;
const PREVIOUS_PAGE = /^go to previous page$/i;
const NEXT_PAGE = /^go to next page$/i;
const LAST_PAGE = /^go to last page$/i;

describe("<ControlledPagination />", () => {
  it("should display pagination navigation", () => {
    getRenderer({
      currentPage: 1,
      itemsCount: 20,
      itemsPerPage: 10,
    });
    expect(getByRole("navigation")).toBeInTheDocument();
  });

  describe("with just one page", () => {
    it.each([FIRST_PAGE, PREVIOUS_PAGE, NEXT_PAGE, LAST_PAGE])(
      "should display go to %p page disabled",
      (expected) => {
        getRenderer({
          currentPage: 1,
          itemsCount: 5,
          itemsPerPage: 10,
        });

        expect(getByRole("button", { name: expected })).toBeDisabled();
      }
    );

    it("should NOT display additional pages", () => {
      getRenderer({
        currentPage: 1,
        itemsCount: 5,
        itemsPerPage: 10,
      });
      expect(
        queryByRole("button", { name: /^Go to page [0-9]/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("with multiple pages", () => {
    it("should display go to next page enabled", () => {
      getRenderer({
        currentPage: 1,
        itemsCount: 20,
        itemsPerPage: 10,
      });
      expect(getByRole("button", { name: NEXT_PAGE })).toBeEnabled();
    });

    it("should have 'Pagination Navigation' aria-label", () => {
      getRenderer({
        currentPage: 1,
        itemsCount: 20,
        itemsPerPage: 10,
      });
      expect(getByLabelText(/^Pagination navigation$/i)).toBeInTheDocument();
    });

    it.each([
      FIRST_PAGE,
      PREVIOUS_PAGE,
      "Page 1 selected",
      "Go to page 2",
      "Go to page 3",
      "Go to page 4",
      NEXT_PAGE,
      LAST_PAGE
    ])(
      "On the first page with 5 pages in total, should have aria-label '%s'",
      (expected) => {
        getRenderer({
          currentPage: 1,
          itemsCount: 50,
          itemsPerPage: 10,
        });
        expect(getByLabelText(expected)).toBeInTheDocument();
      }
    );

    it.each([
      FIRST_PAGE,
      PREVIOUS_PAGE,
      "Go to page 1",
      "Go to page 4",
      "Page 5 selected",
      "Go to page 6",
      "Go to page 10",
      NEXT_PAGE,
      LAST_PAGE
    ])(
      "On page 5 with 10 pages in total, should have aria-label '%s'",
      (expected) => {
        getRenderer({
          currentPage: 5,
          itemsCount: 100,
          itemsPerPage: 10,
        });
        expect(getByLabelText(expected)).toBeInTheDocument();
      }
    );

    it.each([1, 2, 5, 10, 100])(
      "On page %i with 100 pages in total, should have correct aria-label",
      (expected) => {
        getRenderer({
          currentPage: expected,
          itemsCount: 1000,
          itemsPerPage: 10,
        });
        expect(getByLabelText(`Page ${expected} selected`)).toBeInTheDocument();
      }
    );

    it.each([10, 25])("user can see total items '%i'", async (expected) => {
      const itemsPerPage = 5;
      getRenderer({
        currentPage: 1,
        itemsCount: expected,
        itemsPerPage,
      });

      expect(
        await findByTextContent(`Displaying ${itemsPerPage} out of ${expected}`)
      ).toBeInTheDocument();
    });

    it.each([
      [1, 5],
      [3, 2],
    ])("user can see items being displayed", async (currentPage, expected) => {
      const itemsCount = 12;
      getRenderer({
        currentPage,
        itemsCount,
        itemsPerPage: 5,
      });

      expect(
        await findByTextContent(`Displaying ${expected} out of ${itemsCount}`)
      ).toBeInTheDocument();
    });

    it.each([2, 7])(
      "user can see items when fewer than items per page",
      async (expected) => {
        getRenderer({
          currentPage: 1,
          itemsCount: expected,
          itemsPerPage: 10,
        });

        expect(
          await findByTextContent(`Displaying ${expected} out of ${expected}`)
        ).toBeInTheDocument();
      }
    );
  });

  describe("When on the first page", () => {
    it.each([FIRST_PAGE, PREVIOUS_PAGE])("should display %p page disabled", (expected) => {
      getRenderer({
        currentPage: 1,
        itemsCount: 20,
        itemsPerPage: 10,
      });
      expect(getByRole("button", { name: expected })).toBeDisabled();
    });

    it.each([ 6, 7, 8, 9])(
      "should NOT display button to page %i",
      (expected) => {
        getRenderer({
          currentPage: 1,
          itemsCount: 100,
          itemsPerPage: 10,
        });
        expect(
          queryByLabelText(`Go to page ${expected}`)
        ).not.toBeInTheDocument();
      }
    );

    it("should NOT allow user to move to previous page", async () => {
      const didChangePage = jest.fn();
      getRenderer({
        currentPage: 1,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage,
      });

      await userEvent.click(getByLabelText(PREVIOUS_PAGE));
      expect(didChangePage).not.toHaveBeenCalled();
    });

    it("should NOT allow user to move to first page", async () => {
      const didChangePage = jest.fn();
      getRenderer({
        currentPage: 1,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage,
      });

      await userEvent.click(getByLabelText(FIRST_PAGE));
      expect(didChangePage).not.toHaveBeenCalled();
    });

    it("should allow user to move to next page", async () => {
      const didChangePage = jest.fn();
      getRenderer({
        currentPage: 1,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage,
      });
      expect(didChangePage).not.toHaveBeenCalled();

      await userEvent.click(getByLabelText(NEXT_PAGE));
      expect(didChangePage).toHaveBeenCalledTimes(1);
      expect(didChangePage).toHaveBeenCalledWith(2, 10);
    });

    it("should allow user to move to last page", async () => {
      const didChangePage = jest.fn();
      getRenderer({
        currentPage: 1,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage,
      });
      expect(didChangePage).not.toHaveBeenCalled();

      await userEvent.click(getByLabelText(LAST_PAGE));
      expect(didChangePage).toHaveBeenCalledTimes(1);
      expect(didChangePage).toHaveBeenCalledWith(10, 10);
    });

    it.each([2, 3, 4, 5, 10])(
      "should allow user to move to Page %i",
      async (expected) => {
        let expectedPage = 1;

        getRenderer({
          currentPage: 1,
          itemsCount: 100,
          itemsPerPage: 10,
          didChangePage: (page: number) => (expectedPage = page),
        });

        await userEvent.click(getByLabelText(`Go to page ${expected}`));
        expect(expectedPage).toBe(expected);
      }
    );
  });

  describe("When on page 4", () => {
    it.each([FIRST_PAGE, PREVIOUS_PAGE, NEXT_PAGE, LAST_PAGE])("should display %s page enabled", (expected) => {
      getRenderer({
        currentPage: 4,
        itemsCount: 100,
        itemsPerPage: 10,
      });
      screen.debug()
      expect(getByRole("button", { name: expected })).toBeEnabled();
    });

    it.each([1, 10])("should display button to page %i", (expected) => {
      getRenderer({
        currentPage: 4,
        itemsCount: 100,
        itemsPerPage: 10,
      });
      expect(queryByLabelText(`Go to page ${expected}`)).toBeInTheDocument();
    });

    it.each([1, 2, 3, 5, 10])(
      "should allow user to move to Page %i",
      async (expected) => {
        let expectedPage = 4;

        getRenderer({
          currentPage: 4,
          itemsCount: 100,
          itemsPerPage: 10,
          didChangePage: (page: number) => (expectedPage = page),
        });

        await userEvent.click(getByLabelText(`Go to page ${expected}`));
        expect(expectedPage).toBe(expected);
      }
    );
  });

  describe("When on last page (page 10)", () => {
    it.each([2, 3, 4, 5])(
      "should NOT display button to page %i",
      (expected) => {
        getRenderer({
          currentPage: 10,
          itemsCount: 100,
          itemsPerPage: 10,
        });
        expect(
          queryByLabelText(`Go to page ${expected}`)
        ).not.toBeInTheDocument();
      }
    );

    it("should allow user to move to previous page", async () => {
      let expectedPage = 10;

      getRenderer({
        currentPage: 10,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage: (page: number) => (expectedPage = page),
      });

      await userEvent.click(getByLabelText(PREVIOUS_PAGE));
      expect(expectedPage).toBe(9);
    });

    it("should allow user to move to first page", async () => {
      let expectedPage = 10;

      getRenderer({
        currentPage: 10,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage: (page: number) => (expectedPage = page),
      });

      await userEvent.click(getByLabelText(FIRST_PAGE));
      expect(expectedPage).toBe(1);
    });

    it.each([1, 6, 7, 8, 9])(
      "should allow user to move to Page %i",
      async (expected) => {
        const didChangePage = jest.fn();

        getRenderer({
          currentPage: 10,
          itemsCount: 100,
          itemsPerPage: 10,
          didChangePage,
        });
        expect(didChangePage).not.toHaveBeenCalled();

        await userEvent.click(getByLabelText(`Go to page ${expected}`));
        expect(didChangePage).toHaveBeenCalledTimes(1);
        expect(didChangePage).toHaveBeenCalledWith(expected, 10);
      }
    );

    it("should NOT allow user to move to next page", async () => {
      const didChangePage = jest.fn();

      getRenderer({
        currentPage: 10,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage,
      });

      await userEvent.click(getByLabelText(NEXT_PAGE));
      expect(didChangePage).not.toHaveBeenCalled();
    });

    it("should NOT allow user to move to last page", async () => {
      const didChangePage = jest.fn();

      getRenderer({
        currentPage: 10,
        itemsCount: 100,
        itemsPerPage: 10,
        didChangePage,
      });

      await userEvent.click(getByLabelText(LAST_PAGE));
      expect(didChangePage).not.toHaveBeenCalled();
    });
  });
});

function getRenderer({
  currentPage = 1,
  itemsCount = 100,
  itemsPerPage = 10,
  didChangePage = jest.fn(),
}: Partial<ComponentProps<typeof ControlledPagination>>) {
  return render(
    <ControlledPagination
      currentPage={currentPage}
      itemsCount={itemsCount}
      itemsPerPage={itemsPerPage}
      didChangePage={didChangePage}
    />
  );
}
