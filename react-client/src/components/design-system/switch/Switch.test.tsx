import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./Switch";

const { queryByText, getByRole } = screen;

describe("<Switch />", () => {
  it(`should render switch`, () => {
    getRenderer();
    expect(getByRole("switch")).toBeInTheDocument();
  });

  it(`should hide switch label when hideLabel is true`, () => {
    getRenderer({ hideLabel: true });
    expect(queryByText("Test label")).not.toBeInTheDocument();
  });

  it.each([false, undefined])(
    `should render switch label when hideLabel is %s`,
    (expected) => {
      getRenderer({ hideLabel: expected });
      expect(queryByText("Test label")).toBeInTheDocument();
    }
  );

  it.each(["a-class", "another-class"])(
    `should render custom class '%s'`,
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("switch")).toHaveClass(expected);
    }
  );

  it(`should render disabled switch when disabled is true`, () => {
    getRenderer({ disabled: true });
    expect(getByRole("switch")).toBeDisabled();
  });

  it(`should render switch unchecked by default`, () => {
    getRenderer();
    const switchElement = getByRole("switch");
    expect(switchElement).not.toBeChecked();
  });

  it(`should call event callbacks`, async () => {
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
  label = "Test label",
  id = "Test id",
  ...rest
}: Partial<Props> = {}) {
  return render(<Switch label={label} id={id} {...rest} />);
}
