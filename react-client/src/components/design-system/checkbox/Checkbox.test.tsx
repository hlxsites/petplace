import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./Checkbox";

const { queryByText, getByRole } = screen;

describe("<Checkbox />", () => {
  it(`should render checkbox`, () => {
    getRenderer();
    expect(getByRole("checkbox")).toBeInTheDocument();
  });

  it(`should hide checkbox label when hideLabel is true`, () => {
    getRenderer({ hideLabel: true });
    expect(queryByText("Test label")).not.toBeInTheDocument();
  });

  it.each([false, undefined])(
    `should render checkbox label when hideLabel is %s`,
    (expected) => {
      getRenderer({ hideLabel: expected });
      expect(queryByText("Test label")).toBeInTheDocument();
    }
  );

  it.each(["a-class", "another-class"])(
    `should render custom class '%s'`,
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("checkbox")).toHaveClass(expected);
    }
  );

  it(`should render checkbox disabled when disabled is true`, () => {
    getRenderer({ disabled: true });
    expect(getByRole("checkbox")).toBeDisabled();
  });

  it(`should render checkbox unchecked by default`, () => {
    getRenderer();
    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it(`should call event callbacks`, async () => {
    const checkHandler = jest.fn();
    getRenderer({ onCheckedChange: checkHandler });
    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(checkHandler).toHaveBeenCalledTimes(2);
  });

  it("should match snapshot to assure that the component is being rendered correctly", () => {
    const { container } = getRenderer();

    expect(container).toMatchSnapshot();
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
