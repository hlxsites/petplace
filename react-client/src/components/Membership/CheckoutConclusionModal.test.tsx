import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MemoryRouter, Route, Routes, useSearchParams } from "react-router-dom";
import { CONTENT_PARAM_KEY } from "~/util/searchParamsKeys";
import { CheckoutConclusionModal } from "./CheckoutConclusionModal";

const { getByText, getByRole, queryByText } = screen;

const DEFAULT_ID = "test-id";
const PET_PROFILE = "Pet Profile Page";

describe("CheckoutConclusionModal", () => {
  it("should render correct title", () => {
    getRenderer();
    expect(
      getByRole("heading", {
        name: "Congratulations! Your Pet is now covered with 24Petwatch Protection Plan!",
      })
    ).toBeInTheDocument();
  });

  it("should render correct description text", () => {
    getRenderer();
    expect(
      getByText(
        "You can access your plan benefits in your pet profile's “Active pet services” section. Your purchase may take up to 24 hours to reflect. Your invoice and plan details will be emailed shortly."
      )
    ).toBeInTheDocument();
  });

  it("should navigate to pet profile", async () => {
    getRenderer();
    expect(queryByText("Pet Profile Page")).not.toBeInTheDocument();

    await userEvent.click(getByRole("link", { name: "Back to pet profile" }));
    expect(getByText("Pet Profile Page")).toBeInTheDocument();
  });
});

function getRenderer({
  petId = DEFAULT_ID,
}: Partial<ComponentProps<typeof CheckoutConclusionModal>> = {}) {
  return {
    ...render(
      <MemoryRouter initialEntries={["/whatever"]}>
        <Routes>
          <Route
            path="/whatever"
            element={<CheckoutConclusionModal petId={petId} />}
          />
          <Route
            path={`/account/my-pets/:petId`}
            element={<TestPetProfilePage />}
          />
        </Routes>
      </MemoryRouter>
    ),
  };
}

function TestPetProfilePage() {
  const [searchParams] = useSearchParams();
  const contentParam = searchParams.get(CONTENT_PARAM_KEY);

  return (
    <>
      <h1>{PET_PROFILE}</h1>
      <div data-testid="content">{contentParam}</div>
    </>
  );
}
