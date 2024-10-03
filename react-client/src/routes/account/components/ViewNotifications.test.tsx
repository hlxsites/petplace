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

  it("should render the given dateFoundOrLost", () => {
    getRenderer({ dateFoundOrLost: "2024-07-17T10:08:41.857" });
    expect(getByText("7/17/2024")).toBeInTheDocument();
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
  dateFoundOrLost = "2024-07-19T10:08:41.857",
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
