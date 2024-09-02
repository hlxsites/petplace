import { render, screen } from "@testing-library/react";
import { PaymentInformationTabContent } from "./PaymentInformationTabContent";

const { getByRole } = screen;

describe("PaymentInformationTabContent", () => {
  it("should render the expected title for this tab content", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Payment information/i })
    ).toBeInTheDocument();
  });
});

function getRenderer() {
  return render(<PaymentInformationTabContent />);
}
