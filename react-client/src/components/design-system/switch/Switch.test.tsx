import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./Switch";

const { getByLabelText, queryByText } = screen;

describe("<Switch />", () => {
  it(`should render switch`, () => {
    getRenderer();
    expect(getByLabelText("Test label")).toBeInTheDocument();
  });

  it(`should hide switch label`, () => {
    getRenderer({ hideLabel: true });
    expect(queryByText("Test label")).not.toBeInTheDocument();
  });

  it.each(["a-class", "another-class"])(
    `should render custom class '%s'`,
    (expected) => {
      getRenderer({ className: expected });
      expect(getByLabelText("Test label")).toHaveClass(expected);
    }
  );

  it(`should render disabled switch`, () => {
    getRenderer({ disabled: true });
    expect(getByLabelText("Test label")).toBeDisabled();
  });

  it(`should call event callbacks`, async () => {
    const switchHandler = jest.fn();
    getRenderer({ onCheckedChange: switchHandler });
    const switchElement = getByLabelText("Test label");

    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();

    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
    expect(switchHandler).toHaveBeenCalledTimes(2);
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
