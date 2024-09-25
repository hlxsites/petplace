import { render, screen } from "@testing-library/react";
import { AccountDetailsTabContent } from "./AccountDetailsTabContent";

const { getByRole } = screen;

jest.mock("~/util/authUtil", () => ({
  readJwtClaim: jest.fn(),
  checkIsExternalLogin: jest.fn(),
}));

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
