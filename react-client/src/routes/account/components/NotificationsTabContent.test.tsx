import { render, screen } from "@testing-library/react";
import { NotificationsTabContent } from "./NotificationsTabContent";
import { userEvent } from "@testing-library/user-event";
import { ComponentProps } from "react";

const { getByRole, queryByRole } = screen;

describe("NotificationsTabContent", () => {
  it("should render the expected title for this tab content", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Communication Preferences/i })
    ).toBeInTheDocument();
  });

  it("should render expected form 'account-notifications-form'", () => {
    const { container } = getRenderer();
    expect(
      container.querySelector("form[id='account-notifications-form']")
    ).toBeInTheDocument();
  });

  it("should render the 'Offers and Resources' section", () => {
    const { container } = getRenderer();
    expect(
      container.querySelector("section[aria-label='Offers and Resources']")
    ).toBeInTheDocument();
  });

  it("should render the 'Notifications' section", () => {
    const { container } = getRenderer();
    expect(
      container.querySelector("section[aria-label='Notifications']")
    ).toBeInTheDocument();
  });

  it("should render the save button disabled when no value in the form is changed", () => {
    getRenderer();

    expect(getByRole("button", { name: "Save changes" })).toBeDisabled();
  });

  it("should render the save button enabled when a value in the form is changed", async () => {
    getRenderer();

    expect(getByRole("button", { name: "Save changes" })).toBeDisabled();
    await userEvent.click(getByRole("checkbox", { name: "Cat" }));
    expect(getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  it("should render Lost and Found notifications when login is external", () => {
    getRenderer({ isExternalLogin: true });
    expect(
      getByRole("heading", { name: /Lost & Found notifications/i })
    ).toBeInTheDocument();
  });

  it("should NOT render Lost and Found notifications when login is local", () => {
    getRenderer({ isExternalLogin: false });
    expect(
      queryByRole("heading", { name: /Lost & Found notifications/i })
    ).not.toBeInTheDocument();
  });

  it.each(["All", "Incoming found pet alerts"])(
    "should render the selector filter: %s",
    (selector) => {
      getRenderer({ isExternalLogin: true });
      expect(getByRole("checkbox", { name: selector })).toBeInTheDocument();
    }
  );

  it("should render the given lost notifications", () => {
    getRenderer({
      isExternalLogin: true,
      // @ts-expect-error - ignoring for test purposes only
      lostPetsHistory: MOCK_PET_HISTORY,
    });
    expect(getByRole("button", { name: /view/i })).toBeInTheDocument();
  });

  it("should NOT render the lost notifications when it's not provided", () => {
    getRenderer({
      isExternalLogin: true,
      lostPetsHistory: undefined,
    });
    expect(queryByRole("button", { name: /view/i })).not.toBeInTheDocument();
  });
});

function getRenderer({
  ...props
}: Partial<ComponentProps<typeof NotificationsTabContent>> = {}) {
  return render(<NotificationsTabContent {...props} />);
}

const MOCK_PET_HISTORY = [
  {
    petHistory: [
      {
        date: 628021800000,
        foundedBy: {
          finderName: "Mrs Smart",
        },
      },
    ],
    petName: "Mag",
  },
];
