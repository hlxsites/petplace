import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { Tabs, TabsProps } from "./Tabs";

const { getByRole, getByText } = screen;

const testTabs: ComponentProps<typeof Tabs>["tabs"] = [
  {
    content: () => <p>Content 1</p>,
    icon: "check",
    label: "Tab 1",
  },
  {
    content: () => <p>Content 2</p>,
    icon: "ellipse",
    label: "Tab 2",
  },
];

describe("Tab", () => {
  it("should render the given tab and content correctly", () => {
    getRenderer({
      tabs: [
        {
          content: () => <p>Hello world</p>,
          icon: "apps",
          label: "My super tab",
        },
      ],
      value: "My super tab",
    });

    expect(
      getByRole("tab", { name: "Tab option: My super tab" })
    ).toBeInTheDocument();
    expect(
      getByRole("tabpanel", { name: "Tab content of: My super tab" })
    ).toHaveTextContent("Hello world");
  });

  it("should render first tab as active", () => {
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

  it("should call onChange callback", async () => {
    const onChange = jest.fn();
    getRenderer({ onChange });
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(getByText("Tab 2"));
    expect(onChange).toHaveBeenCalledWith("Tab 2");
  });

  it("should render the tab label option with the given icon", () => {
    getRenderer({
      tabs: [
        {
          content: () => <p>warning message</p>,
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
  onChange = jest.fn(),
  tabs = testTabs,
  value = testTabs[0].label,
  ...rest
}: Partial<TabsProps> = {}) {
  return render(
    <Tabs onChange={onChange} tabs={tabs} value={value} {...rest} />
  );
}
