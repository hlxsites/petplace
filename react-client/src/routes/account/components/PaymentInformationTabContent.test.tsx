import { render, screen } from "@testing-library/react";
import { PaymentInformationTabContent } from "./PaymentInformationTabContent";

const { getByRole, getByText } = screen;

describe("PaymentInformationTabContent", () => {
  it("should render the expected title for this tab content", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Payment information/i })
    ).toBeInTheDocument();
  });

  it("should render the payment section as expected", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Payment settings/i })
    ).toBeInTheDocument();
    expect(
      getByText(/Verify, update, or change your payment settings./i)
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: /Manage payment settings/i })
    ).toBeInTheDocument();
  });

  it("should render the submit a claim section as expected", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Submit a claim/i })
    ).toBeInTheDocument();
    expect(
      getByText(/Direct link to your claim submissions on mypethealth.com./i)
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: /Submit a claim/i })
    ).toBeInTheDocument();
  });
});

function getRenderer() {
  return render(<PaymentInformationTabContent />);
}
