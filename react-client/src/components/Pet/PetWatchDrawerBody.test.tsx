import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { PET_WATCH_COMMON_OPTIONS } from "~/routes/my-pets/petId/utils/petWatchConstants";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";

const { getByText, getByRole } = screen;

const PET_WATCH_OPTIONS_LABELS = PET_WATCH_COMMON_OPTIONS.map(
  ({ label }) => label
);

// TODO: Fix tests by mocking the view model
describe.skip("PetWatchDrawerBody", () => {
  it.each(PET_WATCH_OPTIONS_LABELS)(
    "should render option %s by default",
    (expected) => {
      getRenderer();
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render LinkButton with correct route", () => {
    const testRoute = "/test-route";
    getRenderer({ route: testRoute, serviceStatus: "Not a member" });

    expect(getByRole("link", { name: /Upgrade membership/i })).toHaveAttribute(
      "href",
      testRoute
    );
  });
});

function getRenderer({
  route = "/default-route",
  serviceStatus = "Annual member",
}: Partial<ComponentProps<typeof PetWatchDrawerBody>> = {}) {
  return render(
    <MemoryRouter>
      <PetWatchDrawerBody route={route} serviceStatus={serviceStatus} />
    </MemoryRouter>
  );
}
