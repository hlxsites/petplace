import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { PetAlertMessage } from "./PetAlertMessage";

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

    const buttons = getAllByRole("button", { name: /Protect my Pet/i });
    expect(buttons[0]).toHaveClass("hidden lg:flex");
  });

  it("should render lower action button when only for medium or small screens", () => {
    getRenderer();

    const buttons = getAllByRole("button", { name: /Protect my Pet/i });
    expect(buttons[1]).toHaveClass("lg:hidden");
  });

  it("should render LinkButton with correct route", () => {
    const testRoute = "/test-route";
    getRenderer({ route: testRoute });

    const buttons = getAllByRole("link", { name: /Protect my Pet/i });
    expect(buttons[0]).toHaveAttribute("href", testRoute);
    expect(buttons[1]).toHaveAttribute("href", testRoute);
  });
});

function getRenderer({
  icon,
  message = "Message",
  title = "Title",
  route = "/default-route",
}: Partial<ComponentProps<typeof PetAlertMessage>> = {}) {
  return render(
    <MemoryRouter>
      <PetAlertMessage
        icon={icon}
        message={message}
        route={route}
        title={title}
      />
    </MemoryRouter>
  );
}
