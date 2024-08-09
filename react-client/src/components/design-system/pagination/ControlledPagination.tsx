import { Text, TextSpan } from "~/components/design-system";
import { Icon, IconKeys } from "../icon/Icon";
import { PaginateButton } from "./paginateButton/PaginateButton";

export type ControlledPaginationProps = {
  currentPage: number;
  itemsCount: number;
  itemsPerPage?: number;
  didChangePage: (page: number, itemsPerPage: number) => void;
};

export const ControlledPagination = ({
  currentPage,
  itemsCount,
  itemsPerPage = 10,
  didChangePage,
}: ControlledPaginationProps) => {
  const isFirstPage = currentPage === 1;
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  const isLastPage = currentPage === totalPages;

  return (
    <div
      className="flex flex-col md:flex-row md:justify-between"
      data-testid="ControlledPagination"
    >
      <nav
        aria-label="Pagination navigation"
        className="flex justify-center lg:justify-start"
      >
        <PaginateButton
          ariaLabel="Go to first page"
          isDisabled={isFirstPage}
          onClick={goToFirstPage}
        >
          {renderLimitIcon(isFirstPage, "doubleArrowLeft")}
        </PaginateButton>
        <PaginateButton
          ariaLabel="Go to previous page"
          isDisabled={isFirstPage}
          onClick={goToPreviousPage}
        >
          {renderLimitIcon(isFirstPage, "chevronLeft")}
        </PaginateButton>
        {renderPageButtons()}
        <PaginateButton
          ariaLabel="Go to next page"
          isDisabled={isLastPage}
          onClick={goToNextPage}
        >
          {renderLimitIcon(isLastPage, "chevronRight")}
        </PaginateButton>
        <PaginateButton
          ariaLabel="Go to last page"
          isDisabled={isLastPage}
          onClick={goToLastPage}
        >
          {renderLimitIcon(isLastPage, "doubleArrowRight")}
        </PaginateButton>
      </nav>

      <div>{renderTotal()}</div>
    </div>
  );

  function renderPageButtons() {
    if (totalPages <= 7) {
      return generatePageButtons(totalPages, 1);
    }

    if (currentPage < 5) {
      const buttons = generatePageButtons(5, 1);
      buttons.push(renderEllipsis("ellipsis-start"));
      return [...buttons, renderButton(totalPages)];
    }

    if (currentPage > totalPages - 4) {
      const buttons = [renderButton(1)];
      buttons.push(renderEllipsis("ellipsis-end"));
      return [...buttons, ...generatePageButtons(5, totalPages - 4)];
    }

    const buttons = [renderButton(1)];
    let lastRendered = "";
    let ellipsisLabel = "ellipsis-start";
    for (let index = 2; index <= totalPages; index++) {
      if (
        index !== totalPages &&
        (currentPage > index + 1 || currentPage < index - 1)
      ) {
        if (lastRendered === "ellipsis") continue;
        buttons.push(renderEllipsis(ellipsisLabel));
        ellipsisLabel = "ellipsis-end";
        lastRendered = "ellipsis";
      } else {
        buttons.push(renderButton(index));
        lastRendered = "button";
      }
    }

    return buttons;
  }

  function generatePageButtons(amount: number, start: number) {
    const indexes = [];
    let buttonIndex = start;
    for (let i = 0; i < amount; i++) {
      indexes.push(buttonIndex);
      buttonIndex++;
    }
    return indexes.map(renderButton);
  }

  function renderButton(page: number) {
    const isSelected = page === currentPage;
    const ariaLabel = isSelected
      ? `Page ${page} selected`
      : `Go to page ${page}`;

    return (
      <PaginateButton
        ariaLabel={ariaLabel}
        isSelected={isSelected}
        key={page}
        onClick={goToPage(page)}
        className="-mt-[5px]"
      >
        <span className="block w-5">{page}</span>
      </PaginateButton>
    );
  }

  function renderEllipsis(key: string) {
    return (
      <div key={key} className="mx-[4px] -mt-[1px] w-5">
        <TextSpan fontWeight="bold">&hellip;</TextSpan>
      </div>
    );
  }

  function renderLimitIcon(isLimit: boolean, icon: IconKeys) {
    const color = isLimit
      ? "text-neutral-400"
      : "text-orange-300-contrast hover:text-orange-500";
    return <Icon display={icon} className={color} size={16} />;
  }

  function renderTotal() {
    return (
      <div className="flex justify-center lg:justify-end">
        <Text size="base">
          Displaying {renderSpan(currentlyBeingDisplayed())} out of{" "}
          {renderSpan(itemsCount)}
        </Text>
      </div>
    );
  }

  function renderSpan(content: number) {
    return (
      <TextSpan fontWeight="bold" color="orange-300-c">
        {content}
      </TextSpan>
    );
  }

  function currentlyBeingDisplayed() {
    if (itemsCount <= itemsPerPage) return itemsCount;
    if (isLastPage) return itemsCount % itemsPerPage;
    return itemsPerPage;
  }

  function goToFirstPage() {
    if (!isFirstPage) changeCurrentPage(1);
  }

  function goToPreviousPage() {
    if (!isFirstPage) changeCurrentPage(currentPage - 1);
  }

  function goToNextPage() {
    if (!isLastPage) changeCurrentPage(currentPage + 1);
  }

  function goToLastPage() {
    if (!isLastPage) changeCurrentPage(totalPages);
  }

  function goToPage(page: number) {
    return () => changeCurrentPage(page);
  }

  function changeCurrentPage(page: number) {
    didChangePage(page, itemsPerPage);
  }
};
