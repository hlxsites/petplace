import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { getTestTabs } from "~/mocks/mockTabs";
import { getSelectedTab } from "~/util/testingFunctions";
import { RouteBasedTabs } from "./RouteBasedTabs";

const { getAllByRole, getByTestId, getByText, queryByRole } = screen;

describe("RouteBasedTabs", () => {
  it("should display nothing", () => {
    getRenderer({
      tabs: [],
    });
    expect(queryByRole("tab")).not.toBeInTheDocument();
  });

  it("should display tabs", () => {
    const tabs = getTestTabs("123");
    getRenderer({
      tabs,
    });
    tabs.forEach(({ label }) => expect(getByText(label)).toBeInTheDocument());
    expect(getAllByRole("tab")).toHaveLength(tabs.length);
  });

  it.each([
    ["Characteristics", "/characteristics/123"],
    ["Notes", "/notes/123"],
    ["Timeline", "/timeline/123"],
  ])(
    "should start with %s Tab selected when route='%s'",
    (expected, initialRoute) => {
      const tabs = getTestTabs("123");
      getRenderer({
        tabs,
        initialRoute,
      });

      expect(getSelectedTab()).toBe(expected);
    }
  );

  it("should allow user to select tabs", async () => {
    const tabs = getTestTabs();
    getRenderer({
      tabs,
    });

    expect(tabs).toHaveLength(3);

    await userEvent.click(getByText(tabs[2].label));
    expect(getSelectedTab()).toBe(tabs[2].label);

    await userEvent.click(getByText(tabs[1].label));
    expect(getSelectedTab()).toBe(tabs[1].label);
  });

  it("should render first tab content", () => {
    const tabs = getTestTabs();
    getRenderer({
      tabs,
      initialRoute: tabs[0].route,
    });
    expect(getByTestId("CharacteristicsTabContent")).toBeInTheDocument();
  });

  it("should render second tab content", () => {
    const tabs = getTestTabs("222");
    getRenderer({
      tabs,
      initialRoute: tabs[1].route,
    });
    expect(getByTestId("NotesTabContent")).toBeInTheDocument();
  });
});

function getRenderer({
  initialRoute,
  ...props
}: ComponentProps<typeof RouteBasedTabs> & { initialRoute?: string }) {
  return render(
    <MemoryRouter initialEntries={[initialRoute || "/characteristics/123"]}>
      <RouteBasedTabs {...props} />
    </MemoryRouter>
  );
}
