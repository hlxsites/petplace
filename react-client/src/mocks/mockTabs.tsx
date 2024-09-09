export function getTestTabs(id: string = "123") {
  return [
    {
      content: () => <div data-testid="CharacteristicsTabContent" />,
      exactRoute: true,
      label: "Characteristics",
      route: "/characteristics/" + id,
    },
    {
      content: () => <div data-testid="NotesTabContent" />,
      label: "Notes",
      route: "/notes/" + id,
    },
    {
      content: () => <div data-testid="TimelineTabContent" />,
      exactRoute: true,
      label: "Timeline",
      route: "/timeline/" + id,
    },
  ];
}
