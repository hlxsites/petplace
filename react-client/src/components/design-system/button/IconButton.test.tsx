import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { IconKeys } from "../icon/Icon";
import { IconButton } from "./IconButton";

const { getByRole } = screen;

describe("<IconButton />", () => {
  it.each(["a-class", "another-class"])(
    `should render button with custom className %p`,
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("button")).toHaveClass(expected);
    }
  );

  it.each(["Label", "Another label"])(
    "should render button with label %p",
    (expected) => {
      getRenderer({ label: expected });
      expect(getByRole("button", { name: expected })).toBeInTheDocument();
    }
  );

  it.each(["Add", "Check"])(
    "should render an button with %p icon",
    (expected) => {
      const { container } = getRenderer({
        icon: expected.toLowerCase() as IconKeys,
      });
      expect(container.querySelector("svg")).toHaveAttribute(
        "data-file-name",
        `Svg${expected}Icon`
      );
    }
  );

  it("should call onClick callback", async () => {
    const onClick = jest.fn();

    getRenderer({ onClick });
    expect(onClick).not.toHaveBeenCalled();
    const button = getByRole("button");

    await userEvent.click(button);
    await userEvent.click(button);
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

  it("should be enabled by default", () => {
    getRenderer();
    expect(getByRole("button")).toBeEnabled();
  });

  it("should be disabled", () => {
    getRenderer({ disabled: true });
    expect(getByRole("button")).toBeDisabled();
  });

  it.each(["sample-id", "another-id"])(
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

  it('should render button with "primary" variant by default', () => {
    getRenderer();
    expect(getByRole("button")).toHaveClass(
      "bg-orange-300-contrast text-white"
    );
  });

  it('should render button with "secondary" variant', () => {
    getRenderer({ variant: "secondary" });
    expect(getByRole("button")).toHaveClass("text-neutral-700");
  });

  it('should render button with "link" variant', () => {
    getRenderer({ variant: "link" });
    expect(getByRole("button")).toHaveClass(
      "px-xsmall py-xsmall hover:bg-transparent hover:border-transparent bg-transparent text-neutral-700 lg:px-small lg:py-small focus:bg-transparent"
    );
  });

  it('should render button with "error" variant', () => {
    getRenderer({ variant: "error" });
    expect(getByRole("button")).toHaveClass("bg-red-300 text-white");
  });

  it("should not be loading by default", () => {
    getRenderer();
    expect(getByRole("button")).not.toHaveClass("loading");
  });

  it("should render button with loading state", () => {
    getRenderer({ isLoading: true });
    expect(getByRole("button")).toHaveClass("loading");
  });
});

// Helpers
type Props = ComponentProps<typeof IconButton>;
function getRenderer({
  icon = "add",
  label = "Test label",
  ...rest
}: Partial<Props> = {}) {
  return render(<IconButton icon={icon} label={label} {...rest} />);
}
