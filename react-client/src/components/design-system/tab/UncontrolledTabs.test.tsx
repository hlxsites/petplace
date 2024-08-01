import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { getSelectedTab } from "~/util/testingFunctions";
import { UncontrolledTabs } from "./UncontrolledTabs";

const { getAllByRole, getByTestId, getByText } = screen;

const DEFAULT_CONTENT = () => <p>nothing</p>;

describe("<UncontrolledTabs />", () => {
  it.each([
    [
      [
        { content: DEFAULT_CONTENT, label: "Characteristics" },
        { content: DEFAULT_CONTENT, label: "Timeline" },
      ],
    ],
    [
      [
        { content: DEFAULT_CONTENT, label: "Notes" },
        { content: DEFAULT_CONTENT, label: "Financial" },
        { content: DEFAULT_CONTENT, label: "Listing" },
        { content: DEFAULT_CONTENT, label: "Medical" },
      ],
    ],
  ])("should display tabs %p", (tabs) => {
    getRenderer({ tabs });
    tabs.forEach(({ label }) => expect(getByText(label)).toBeInTheDocument());
    expect(getAllByRole("tab")).toHaveLength(tabs.length);
  });

  it.each([["Characteristics"], ["Notes"], ["Timeline"]])(
    "should start with %p Tab selected when initialIndex=%i",
    (expected) => {
      getRenderer({
        tabs: [
          {
            content: DEFAULT_CONTENT,
            label: "Characteristics",
          },
          {
            content: DEFAULT_CONTENT,
            label: "Notes",
          },
          {
            content: DEFAULT_CONTENT,
            label: "Timeline",
          },
        ],
        initialTab: expected,
      });
      expect(getSelectedTab()).toBe(expected);
    }
  );

  it("should allow user to select tabs", async () => {
    const tabs = [
      {
        content: DEFAULT_CONTENT,
        label: "Characteristics",
      },
      {
        content: DEFAULT_CONTENT,
        label: "Notes",
      },
      {
        content: DEFAULT_CONTENT,
        label: "Timeline",
      },
    ];
    getRenderer({
      tabs,
    });

    await userEvent.click(getByText(tabs[1].label));
    expect(getSelectedTab()).toBe(tabs[1].label);

    await userEvent.click(getByText(tabs[2].label));
    expect(getSelectedTab()).toBe(tabs[2].label);

    await userEvent.click(getByText(tabs[0].label));
    expect(getSelectedTab()).toBe(tabs[0].label);
  });

  it("should render content", async () => {
    const tabs = [
      {
        content: () => <div data-testid="CharacteristicsTabContent" />,
        label: "Characteristics",
      },
      {
        content: () => <div data-testid="NotesTabContent" />,
        label: "Notes",
      },
      {
        content: () => <div data-testid="TimelineTabContent" />,
        label: "Timeline",
      },
    ];
    getRenderer({
      tabs,
    });
    expect(getByTestId("CharacteristicsTabContent")).toBeInTheDocument();

    await userEvent.click(getByText("Timeline"));
    expect(getByTestId("TimelineTabContent")).toBeInTheDocument();
  });
});

function getRenderer(props: ComponentProps<typeof UncontrolledTabs>) {
  return render(<UncontrolledTabs {...props} />);
}
