import { render, screen } from "@testing-library/react";
import { Tab } from "./Tab";
import { ComponentProps } from "react";
import userEvent from "@testing-library/user-event";

const { getByRole, getByText, queryByText } = screen;

const testTabs: ComponentProps<typeof Tab>["tabs"] = [
  {
    content: <p>Content 1</p>,
    icon: "check",
    label: "Tab 1",
  },
  {
    content: <p>Content 2</p>,
    icon: "ellipse",
    label: "Tab 2",
  },
];

describe("Tab", () => {
  it("should render the given tab and content correctly", () => {
    getRenderer({
      tabs: [
        {
          content: <p>Hello world</p>,
          icon: "apps",
          label: "My super tab",
        },
      ],
    });

    expect(
      getByRole("tab", { name: "Tab option: My super tab" })
    ).toBeInTheDocument();
    expect(
      getByRole("tabpanel", { name: "Tab content of: My super tab" })
    ).toHaveTextContent("Hello world");
  });

  it("should render first tab as active by default", () => {
    getRenderer();

    expect(getByRole("tab", { name: "Tab option: Tab 1" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(getByRole("tab", { name: "Tab option: Tab 2" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("should be able to switch between on tabs", async () => {
    getRenderer();

    expect(getByRole("tab", { name: "Tab option: Tab 2" })).toHaveAttribute(
      "aria-selected",
      "false"
    );

    // selecting TAB 2
    await userEvent.click(getByText("Tab 2"));
    expect(getByRole("tab", { name: "Tab option: Tab 2" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(getByRole("tab", { name: "Tab option: Tab 1" })).toHaveAttribute(
      "aria-selected",
      "false"
    );

    // selecting TAB 1
    await userEvent.click(getByText("Tab 1"));
    expect(getByRole("tab", { name: "Tab option: Tab 1" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(getByRole("tab", { name: "Tab option: Tab 2" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("should switch content when clicking on tabs", async () => {
    getRenderer();

    expect(getByText("Content 1")).toBeInTheDocument();
    expect(queryByText("Content 2")).not.toBeInTheDocument();

    await userEvent.click(getByText("Tab 2"));
    expect(queryByText("Content 1")).not.toBeInTheDocument();
    expect(getByText("Content 2")).toBeInTheDocument();
  });

  it("should render the tab label option with the given icon", () => {
    getRenderer({
      tabs: [
        {
          content: <p>warning message</p>,
          icon: "warningTriangle",
          label: "Warning tab",
        },
      ],
    });

    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgWarningTriangleIcon"
    );
  });

  it("should have correct accessibility attributes", () => {
    getRenderer();

    const tab1 = getByRole("tab", { name: `Tab option: ${testTabs[0].label}` });

    // Ensure the tab has proper aria-label
    expect(tab1).toBeInTheDocument();

    // Ensure the tabpanel has proper aria-label
    expect(
      getByRole("tabpanel", { name: `Tab content of: ${testTabs[0].label}` })
    ).toBeInTheDocument();

    // Ensure correct aria-selected state
    expect(tab1).toHaveAttribute("aria-selected", "true");

    // Verify aria-controls relationship between tab and tabpanel
    const tab1Id = tab1.getAttribute("aria-controls");
    expect(
      getByRole("tabpanel", { name: "Tab content of: Tab 1" })
    ).toHaveAttribute("id", tab1Id);
  });
});

function getRenderer({
  tabs = testTabs,
}: Partial<ComponentProps<typeof Tab>> = {}) {
  return render(<Tab tabs={tabs} />);
}
