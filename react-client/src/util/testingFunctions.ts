import { screen } from "@testing-library/react";

export function getSelectedTab() {
  return screen.getByRole("tab", { selected: true }).textContent;
}