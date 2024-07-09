import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { IconButton } from "./IconButton";
import { IconKeys } from "../icon/Icon";

const { getByRole, getByLabelText } = screen;

describe("<IconButton />", () => {
  it.each(["a-class", "another-class"])(
    `should render button with custom className '%s'`,
    (expected) => {
      getRenderer({ className: expected });
      expect(getByRole("button")).toHaveClass(expected);
    }
  );

  it.each(["Label", "Another label"])(
    "should render button with label '%s'",
    (expected) => {
      getRenderer({ label: expected });
      expect(getByLabelText(expected).tagName).toBe("BUTTON");
    }
  );

  it.each(["Add", "Check"])(
    `should render an button with '%s' icon`,
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
type Props = ComponentProps<typeof IconButton>;
function getRenderer({
  icon = "add",
  label = "Test label",
  ...rest
}: Partial<Props> = {}) {
  return render(<IconButton icon={icon} label={label} {...rest} />);
}
