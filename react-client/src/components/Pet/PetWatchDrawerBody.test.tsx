import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PET_WATCH_COMMON_OPTIONS } from "~/routes/my-pets/petId/utils/petWatchConstants";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";
import { MemoryRouter } from "react-router-dom";

const { getByText, getByRole } = screen;

const DEFAULT_CONTENT = {
  title: "Test title",
  subtitle: "Test subtitle",
  description: "Test description",
};

const PET_WATCH_OPTIONS_LABELS = PET_WATCH_COMMON_OPTIONS.map(
  ({ label }) => label
);

describe("PetWatchDrawerBody", () => {
  it.each(PET_WATCH_OPTIONS_LABELS)(
    "should render option %s by default",
    (expected) => {
      getRenderer();
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render service details when selected", () => {
    getRenderer({ contentDetails: DEFAULT_CONTENT });
    expect(getByText(DEFAULT_CONTENT.description)).toBeInTheDocument();
  });

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
  onClick = jest.fn(),
  route = "/default-route",
  serviceStatus = "Annual member",
  ...props
}: Partial<ComponentProps<typeof PetWatchDrawerBody>> = {}) {
  return render(
    <MemoryRouter>
      <PetWatchDrawerBody
        onClick={onClick}
        route={route}
        serviceStatus={serviceStatus}
        {...props}
      />
    </MemoryRouter>
  );
}
