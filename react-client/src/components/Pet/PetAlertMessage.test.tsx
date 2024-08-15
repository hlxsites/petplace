import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PetAlertMessage } from "./PetAlertMessage";
import userEvent from "@testing-library/user-event";

const { getByRole, getByText, getAllByRole } = screen;

describe("AlertMessage", () => {
  it.each([
    ["apps", "SvgAppsIcon"],
    ["chevronUp", "SvgChevronUpIcon"],
  ])("should render the component with the given icon", (icon, expected) => {
    // @ts-expect-error - ignoring for test purposes only
    getRenderer({ icon });

    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      expected
    );
  });

  it("should render component with stethoscope icon when no icon is provided", () => {
    getRenderer();

    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgStethoscopeIcon"
    );
  });

  it.each(["Sample title", "Awesome title"])(
    "should render the given title of the alert message",
    (title) => {
      getRenderer({ title });

      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["Cool message", "Awesome message"])(
    "should render the given message of the alert",
    (message) => {
      getRenderer({ message });

      expect(getByText(message)).toBeInTheDocument();
    }
  );

  it("should render top action button only for large screens", () => {
    getRenderer();

    const buttons = getAllByRole("button", { name: /Get Quote Now/i });
    expect(buttons[0]).toHaveClass("hidden lg:flex");
  });

  it("should render lower action button when only for medium or small screens", () => {
    getRenderer();

    const buttons = getAllByRole("button", { name: /Get Quote Now/i });
    expect(buttons[1]).toHaveClass("lg:hidden");
  });

  it("should call onClick when user clicks on action button", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });

    const buttons = getAllByRole("button", { name: /Get Quote Now/i });

    expect(onClick).not.toHaveBeenCalled();
    await userEvent.click(buttons[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

function getRenderer({
  icon,
  onClick,
  message = "Message",
  title = "Title",
}: Partial<ComponentProps<typeof PetAlertMessage>> = {}) {
  return render(
    <PetAlertMessage
      icon={icon}
      message={message}
      onClick={onClick}
      title={title}
    />
  );
}
