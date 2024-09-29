import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { ViewNotifications } from "./ViewNotifications";

const { getByText, getByRole } = screen;

describe("ViewNotifications", () => {
  it.each(["Barb", "Thomas"])(
    "should render the given petName=%s",
    (petName) => {
      getRenderer({ petName });
      expect(
        getByText(`Pet ${petName} is found by Jane Doe`)
      ).toBeInTheDocument();
    }
  );

  it.each(["Janet", "Paul"])(
    "should render the given foundedBy=%s",
    (foundedBy) => {
      getRenderer({ foundedBy });
      expect(
        getByText(`Pet Juan is found by ${foundedBy}`)
      ).toBeInTheDocument();
    }
  );

  it("should render the given dateFoundOrLost=%s", () => {
    // TODO use parseDate after API defines that this is string datetime
    const convertedDate = new Date(628021800000).toISOString().split("T")[0];
    getRenderer({ dateFoundOrLost: 628021800000 });
    expect(getByText(`${convertedDate}`)).toBeInTheDocument();
  });

  it("should render button with expected icon and label", () => {
    getRenderer();
    expect(
      document.querySelector("svg[data-file-name='SvgEyeIcon']")
    ).toBeInTheDocument();
    expect(getByRole("button", { name: /View/i })).toBeInTheDocument();
  });
});

function getRenderer({
  dateFoundOrLost = 628021800000,
  foundedBy = "Jane Doe",
  notificationId = "notification-id",
  petName = "Juan",
}: Partial<ComponentProps<typeof ViewNotifications>> = {}) {
  return render(
    <MemoryRouter>
      <ViewNotifications
        dateFoundOrLost={dateFoundOrLost}
        foundedBy={foundedBy}
        notificationId={notificationId}
        petName={petName}
      />
    </MemoryRouter>
  );
}
