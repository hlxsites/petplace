import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { PaginateButton } from "./PaginateButton";

const { getByLabelText } = screen;

const DEFAULT_LABEL = "Test label";
const DEFAULT_CHILDREN = "Test children";
const DEFAULT_CLASSES =
  "flex items-center hover:text-orange-500 focus:outline-none disabled:bg-transparent disabled:hover:bg-transparent";

describe("<PaginateButton />", () => {
  it("should render button", () => {
    getRenderer();
    expect(getByLabelText(DEFAULT_LABEL)).toBeInTheDocument();
  });

  it("should render button with default classes", () => {
    getRenderer();
    expect(getByLabelText(DEFAULT_LABEL)).toHaveClass(DEFAULT_CLASSES);
  });

  it.each(["A label", "Another label"])(
    "should render button with label %p",
    (expected) => {
      getRenderer({ ariaLabel: expected });
      expect(getByLabelText(expected)).toBeInTheDocument();
    }
  );

  it.each(["A children", "Another children"])(
    "should render children %s",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByLabelText(DEFAULT_LABEL)).toHaveTextContent(expected);
    }
  );

  it("should render button disabled when isDisabled true", () => {
    getRenderer({ isDisabled: true });
    expect(getByLabelText(DEFAULT_LABEL)).toBeDisabled();
  });

  it("should render button disabled when isSelected true", () => {
    getRenderer({ isSelected: true });
    expect(getByLabelText(DEFAULT_LABEL)).toBeDisabled();
  });

  it('should render button with "page" aria-current when isSelected true', () => {
    getRenderer({ isSelected: true });
    expect(getByLabelText(DEFAULT_LABEL)).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it('should render button without "page" aria-current when isSelected false', () => {
    getRenderer();
    expect(getByLabelText(DEFAULT_LABEL)).not.toHaveAttribute("aria-current");
  });

  it("should render button with disabled classes", () => {
    getRenderer({ isDisabled: true });
    expect(getByLabelText(DEFAULT_LABEL)).toHaveClass(
      `${DEFAULT_CLASSES} text-neutral-400`
    );
  });

  it("should render button with selected classes", () => {
    getRenderer({ isSelected: true });
    expect(getByLabelText(DEFAULT_LABEL)).toHaveClass(
      `${DEFAULT_CLASSES} text-orange-300-contrast`
    );
  });

  it("should call onClick callbacks", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });
    expect(onClick).not.toHaveBeenCalled();

    await userEvent.click(getByLabelText(DEFAULT_LABEL));
    expect(onClick).toHaveBeenCalled();
  });
});

// Helpers
type Props = ComponentProps<typeof PaginateButton>;
function getRenderer({
  ariaLabel = DEFAULT_LABEL,
  children = DEFAULT_CHILDREN,
  onClick = jest.fn(),
  ...rest
}: Partial<Props> = {}) {
  return render(
    <PaginateButton ariaLabel={ariaLabel} onClick={onClick} {...rest}>
      {children}
    </PaginateButton>
  );
}
