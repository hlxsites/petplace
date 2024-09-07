import { render, screen } from "@testing-library/react";
import { AccountDetailsTabContent } from "./AccountDetailsTabContent";

const { getByRole } = screen;

describe("AccountDetailsTabContent", () => {
  it("should render card with expected title", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /^contact info$/i })
    ).toBeInTheDocument();
  });
});

function getRenderer() {
  return render(<AccountDetailsTabContent />);
}
