import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { Button } from "./Button";

const { getByRole } = screen;

describe("<Button />", () => {
  it.each(["a-class", "another-class"])(
    `should render %p as a className`,
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("button")).toHaveClass(`${expected}`);
    }
  );

  it.each(["Label", "Another label"])(
    "should render button with text '%s'",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByRole("button", { name: expected })).toBeInTheDocument();
    }
  );

  it("should call onClick callback", async () => {
    const onClick = jest.fn();

    getRenderer({ onClick });
    expect(onClick).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button"));
    await userEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("should have type='button' by default", () => {
    getRenderer();
    expect(getByRole("button")).toHaveAttribute("type", "button");
  });

  it("should have type='submit", () => {
    getRenderer({ type: "submit" });
    expect(getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("should be enabled", () => {
    getRenderer({ disabled: false });

    const button = getByRole("button");
    expect(button).toBeEnabled();
  });

  it("should be disabled", async () => {
    const onClick = jest.fn();

    getRenderer({ disabled: true, onClick });

    const button = getByRole("button");
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(["the-button-id", "another-button-id"])(
    "button should have id '%s'",
    (expected) => {
      getRenderer({ id: expected });
      expect(getByRole("button")).toHaveAttribute("id", expected);
    }
  );

  it.each(["Custom button", "Another button"])(
    "should have aria-label '%s'",
    (expected) => {
      getRenderer({ "aria-label": expected });
      expect(getByRole("button")).toHaveAttribute("aria-label", expected);
    }
  );
});

// Helpers
type Props = ComponentProps<typeof Button>;
function getRenderer({
  children = <p>Alert text</p>,
  ...rest
}: Partial<Props> = {}) {
  return render(<Button {...rest}>{children}</Button>);
}
