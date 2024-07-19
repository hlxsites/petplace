import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./Switch";

const { queryByText, getByRole } = screen;

const DEFAULT_LABEL = "Test label";
const DEFAULT_CLASSES = "h-6 w-[52px] rounded-[21px]";

describe("<Switch />", () => {
  it("should render switch", () => {
    getRenderer();
    expect(getByRole("switch")).toBeInTheDocument();
  });

  it("should hide switch label when hideLabel is true", () => {
    getRenderer({ hideLabel: true });
    expect(queryByText(DEFAULT_LABEL)).not.toBeInTheDocument();
  });

  it.each([false, undefined])(
    "should render switch label when hideLabel is %s",
    (expected) => {
      getRenderer({ hideLabel: expected });
      expect(queryByText(DEFAULT_LABEL)).toBeInTheDocument();
    }
  );

  it("should render default classes", () => {
    getRenderer();
    expect(getByRole("switch")).toHaveClass(DEFAULT_CLASSES);
  });

  it("should render checkbox with accessible aria-label when hideLabel is true", () => {
    getRenderer({ hideLabel: true });
    expect(getByRole("switch", { name: DEFAULT_LABEL })).toBeInTheDocument();
  });


  it.each(["a-class", "another-class"])(
    `should render custom class '%s'`,
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("switch")).toHaveClass(`${DEFAULT_CLASSES} ${expected}`);
    }
  );

  it.each(["an-id", "another-id"])('should render with id "%s"', (expected) => {
    getRenderer({ id: expected });
    expect(getByRole("switch")).toHaveAttribute("id", expected);
  });

  it.each(["a label", "another label"])("should render with label '%s'", (expected) => {
    getRenderer({ label: expected });
    expect(getByRole("switch", { name: expected})).toBeInTheDocument();
  });

  it("should be enabled by default", () => {
    getRenderer();
    expect(getByRole("switch")).toBeEnabled();
  });

  it("should render switch disabled when disabled is true", () => {
    getRenderer({ disabled: true });
    expect(getByRole("switch")).toBeDisabled();
  });

  it("should render switch unchecked by default", () => {
    getRenderer();
    const switchElement = getByRole("switch");
    expect(switchElement).not.toBeChecked();
  });

  it("should render switch checked", () => {
    getRenderer({ defaultChecked: true });
    const switchElement = getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  it("should render switch checked classes", () => {
    getRenderer({ defaultChecked: true });
    const switchElement = getByRole("switch");
    expect(switchElement).toHaveClass("border-none bg-orange-300-contrast focus:bg-orange-300-contrast");
  });

  it("should render switch checked classes", () => {
    getRenderer({ defaultChecked: false });
    const switchElement = getByRole("switch");
    expect(switchElement).not.toHaveClass("border-none bg-orange-300-contrast focus:bg-orange-300-contrast");
  });

  it("should call event callbacks", async () => {
    const switchHandler = jest.fn();
    getRenderer({ onCheckedChange: switchHandler });
    const switchElement = getByRole("switch");
    expect(switchElement).not.toBeChecked();

    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();

    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
    expect(switchHandler).toHaveBeenCalledTimes(2);
  });

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();

    expect(container).toMatchSnapshot();
  });
});

// Helpers
type Props = ComponentProps<typeof Switch>;
function getRenderer({
  label = DEFAULT_LABEL,
  id = "Test id",
  ...rest
}: Partial<Props> = {}) {
  return render(<Switch label={label} id={id} {...rest} />);
}
