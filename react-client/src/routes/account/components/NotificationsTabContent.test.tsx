import { render, screen, within } from "@testing-library/react";
import { NotificationsTabContent } from "./NotificationsTabContent";

const { getByRole } = screen;

describe("NotificationsTabContent", () => {
  it("should render the expected title for this tab content", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Communication Preferences/i })
    ).toBeInTheDocument();
  });

  it("should render card with 'region' role to ensure accessibility", () => {
    getRenderer();
    expect(getByRole("region")).toBeInTheDocument();
  });

  it("should render card with expected title", () => {
    getRenderer();
    expect(
      within(getByRole("region")).getByRole("heading", {
        name: /Offers and Resources/i,
      })
    ).toBeInTheDocument();
  });
});

function getRenderer() {
  return render(<NotificationsTabContent />);
}
