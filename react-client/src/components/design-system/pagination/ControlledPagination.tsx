
import type { FC, ReactElement, ReactNode } from "react";
import { Icon, IconKeys } from "../icon/Icon";
import { PaginateButton } from "./paginateButton/PaginateButton";
import { Text, TextSpan } from "~/components/design-system";

interface IControlledPaginationProps {
  children?: ReactNode;
  className?: string;
  currentPage: number;
  itemsCount: number;
  itemsPerPage?: number;
  onChange: (page: number, itemsPerPage: number) => void;
}

export const ControlledPagination: FC<IControlledPaginationProps> = ({
  children,
  className,
  currentPage,
  itemsCount,
  itemsPerPage = 10,
  onChange,
}) => {
  const isFirstPage = currentPage === 1;
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  const isLastPage = currentPage === totalPages;

  return (
    <div className={className}>
      {children}

      <div className="flex justify-between" data-testid="ControlledPagination">
        <nav aria-label="Pagination navigation" className="flex">
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
    </div>
  );

  function renderPageButtons() {
    const buttons: ReactElement[] = [];

    const [startIndex, endIndex] = calculateStartAndEndIndexes(1);

    if (startIndex > 1) {
      buttons.push(renderButton(1)); // First page
      if (startIndex > 2) buttons.push(renderEllipsis("ellipsis-start"));
    }

    for (let index = startIndex; index <= endIndex; index++) {
      buttons.push(renderButton(index));
    }

    if (endIndex < totalPages) {
      if (endIndex < totalPages - 1)
        buttons.push(renderEllipsis("ellipsis-end"));
      buttons.push(renderButton(totalPages));
    }

    return buttons;
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
        <span>{page}</span>
      </PaginateButton>
    );
  }

  function renderEllipsis(key: string) {
    return (
      <div className="mt-[4px]">
        <TextSpan key={key} fontWeight="bold">
          &hellip;
        </TextSpan>
      </div>
    );
  }

  function calculateStartAndEndIndexes(siblingCount: number = 1) {
    const totalShownPages = siblingCount + 5;
    let startIndex = Math.max(currentPage - siblingCount, 1);
    let endIndex = Math.min(startIndex + siblingCount * 2, totalPages);

    if (totalPages <= totalShownPages - 2) {
      return [1, totalPages];
    }

    if (currentPage <= siblingCount + 3) {
      endIndex = totalShownPages - 2;
      return [1, endIndex];
    }

    if (currentPage >= totalPages - (siblingCount + 2)) {
      startIndex = totalPages - (totalShownPages - 3);
      return [startIndex, totalPages];
    }

    return [startIndex, endIndex];
  }

  function renderLimitIcon(isLimit: boolean, icon: IconKeys) {
    const color = isLimit
      ? "text-neutral-400"
      : "text-orange-300-contrast hover:text-orange-500";
    return <Icon display={icon} className={color} size={16} />;
  }

  function renderTotal() {
    return (
      <Text size="base">
        Displaying {renderSpan(currentlyBeingDisplayed())} out of{" "}
        {renderSpan(itemsCount)}
      </Text>
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
    onChange(page, itemsPerPage);
  }
};
