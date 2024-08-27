import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { BrowserRouter } from "react-router-dom";
import { CheckoutConclusionModal } from "./CheckoutConclusionModal";

const { getByText, getByRole } = screen;

const DEFAULT_ID = "test-id";

describe("CheckoutConclusionModal", () => {
  it("should render correct title", () => {
    getRenderer();
    expect(
      getByRole("heading", {
        name: "Congratulations! Your Pet’s Protection Plan is Now Active!",
      })
    ).toBeInTheDocument();
  });

  it("should render correct title", () => {
    getRenderer();
    expect(
      getByText(
        "You can now access all the benefits of your selected tier, including 24/7 Vet Help and Lost Pet Protection, in the Membership section."
      )
    ).toBeInTheDocument();
  });

  it.each(["Back to pet profile", "See my benefits"])(
    "should render correct title",
    (expected) => {
      getRenderer();
      expect(getByRole("button", { name: expected })).toBeInTheDocument();
    }
  );
});

function getRenderer({
  petId = DEFAULT_ID,
}: Partial<ComponentProps<typeof CheckoutConclusionModal>> = {}) {
  return render(
    <BrowserRouter>
      <CheckoutConclusionModal petId={petId} />
    </BrowserRouter>
  );
}
