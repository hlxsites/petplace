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
    "should render button with text %p",
    (expected) => {
      getRenderer({ children: expected });
      expect(getByRole("button", { name: expected })).toBeInTheDocument();
    }
  );

  it("should have type='button' by default", () => {
    getRenderer();
    expect(getByRole("button")).toHaveAttribute("type", "button");
  });

  it.each(["reset", "submit"])("should have type=%p", (type) => {
    // @ts-expect-error - ignoring type error for testing purposes
    getRenderer({ type });
    expect(getByRole("button")).toHaveAttribute("type", type);
  });

  it("should be enabled", () => {
    getRenderer({ disabled: false });
    expect(getByRole("button")).toBeEnabled();
  });

  it("should be disabled", () => {
    getRenderer({ disabled: true });
    expect(getByRole("button")).toBeDisabled();
  });

  it.each(["the-button-id", "another-button-id"])(
    "button should have id %p",
    (expected) => {
      getRenderer({ id: expected });
      expect(getByRole("button")).toHaveAttribute("id", expected);
    }
  );

  it.each(["Custom button", "Another button"])(
    "should have aria-label %p",
    (expected) => {
      getRenderer({ "aria-label": expected });
      expect(getByRole("button")).toHaveAttribute("aria-label", expected);
    }
  );

  it("should have base classes", () => {
    getRenderer();

    expect(getByRole("button")).toHaveClass("px-base py-small text-base");
  });

  it("should have primary variant classes", () => {
    getRenderer({ variant: "primary" });

    expect(getByRole("button")).toHaveClass(
      "bg-orange-300-contrast text-white"
    );
  });

  it("should have secondary variant classes", () => {
    getRenderer({ variant: "secondary" });

    expect(getByRole("button")).toHaveClass(
      "bg-white border-neutral-700 text-neutral-700"
    );
  });

  it("should have tertiary variant classes", () => {
    getRenderer({ variant: "tertiary" });

    expect(getByRole("button")).toHaveClass("bg-orange-100  text-orange-500");
  });

  it("should not be full width by default", () => {
    getRenderer();
    expect(getByRole("button")).not.toHaveClass("w-full");
  });

  it("should have full width class", () => {
    getRenderer({ fullWidth: true });
    expect(getByRole("button")).toHaveClass("w-full");
  });

  describe("onClick callback", () => {
    it("should call it", async () => {
      const onClick = jest.fn();

      getRenderer({ onClick });
      expect(onClick).not.toHaveBeenCalled();

      await userEvent.click(getByRole("button"));
      await userEvent.click(getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("should not call it when it is disabled", async () => {
      const onClick = jest.fn();
      getRenderer({ disabled: true, onClick });

      await userEvent.click(getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

// Helpers
type Props = ComponentProps<typeof Button>;
function getRenderer({
  children = <p>Alert text</p>,
  ...rest
}: Partial<Props> = {}) {
  return render(<Button {...rest}>{children}</Button>);
}
