import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./Checkbox";

const { getByLabelText, queryByText } = screen;

describe("<Checkbox />", () => {
  it(`should render checkbox`, () => {
    getRenderer();
    expect(getByLabelText("Test label")).toBeInTheDocument();
  });

  it(`should hide checkbox label`, () => {
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

  it(`should render disabled checkbox`, () => {
    getRenderer({ disabled: true });
    expect(getByLabelText("Test label")).toBeDisabled();
  });

  it(`should call event callbacks`, async () => {
    const checkHandler = jest.fn();
    getRenderer({ onCheckedChange: checkHandler });
    const checkbox = getByLabelText("Test label");

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(checkHandler).toHaveBeenCalledTimes(2);
  });
});

// Helpers
type Props = ComponentProps<typeof Checkbox>;
function getRenderer({
  label = "Test label",
  id = "Test id",
  ...rest
}: Partial<Props> = {}) {
  return render(<Checkbox label={label} id={id} {...rest} />);
}
