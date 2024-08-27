import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CheckoutConclusionModal } from "./CheckoutConclusionModal";

const { getByText, getByRole, queryByText } = screen;

const DEFAULT_ID = "test-id";
const PET_PROFILE = "Pet Profile Page";

describe("CheckoutConclusionModal", () => {
  it("should render correct title", () => {
    getRenderer();
    expect(
      getByRole("heading", {
        name: "Congratulations! Your Pet’s Protection Plan is Now Active!",
      })
    ).toBeInTheDocument();
  });

  it("should render correct description text", () => {
    getRenderer();
    expect(
      getByText(
        "You can now access all the benefits of your selected tier, including 24/7 Vet Help and Lost Pet Protection, in the Membership section."
      )
    ).toBeInTheDocument();
  });

  it("should navigate to pets id", async () => {
    getRenderer();
    expect(queryByText("Pet Profile Page")).not.toBeInTheDocument();

    await userEvent.click(getByRole("button", { name: "Back to pet profile" }));
    expect(getByText("Pet Profile Page")).toBeInTheDocument();
  });

  it.each(["Back to pet profile", "See my benefits"])(
    "should render correct buttons",
    (expected) => {
      getRenderer();
      expect(getByRole("button", { name: expected })).toBeInTheDocument();
    }
  );
});

function getRenderer({
  petId = DEFAULT_ID,
}: Partial<ComponentProps<typeof CheckoutConclusionModal>> = {}) {
  return {
    ...render(
      <MemoryRouter initialEntries={[`/checkout/${petId}`]}>
        <Routes>
          <Route
            path={`/checkout/:petId`}
            element={<CheckoutConclusionModal petId={petId} />}
          />
          <Route
            path={`/my-pets/${DEFAULT_ID}`}
            element={<div>{PET_PROFILE}</div>}
          />
        </Routes>
      </MemoryRouter>
    ),
  };
}
