import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { AccountNotificationsIndex } from "./AccountNotificationsIndex";

// TODO: This shouldn't be needed after refactoring how to handle account form
jest.mock("~/util/authUtil", () => ({
  readJwtClaim: jest.fn(),
  checkIsSsoEnabledLogin: jest.fn().mockReturnValue(false),
}));

const { getByRole, queryByRole, findByRole } = screen;

// TODO: mock the useAccountContext hook
describe.skip("NotificationsTabContent", () => {
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
    getRenderer();
    expect(
      getByRole("heading", { name: /Offers and Resources/i })
    ).toBeInTheDocument();
  });

  it("should render the 'Notifications' section", () => {
    getRenderer();
    expect(
      getByRole("heading", { name: /Notifications/i })
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
    getRenderer();
    expect(
      getByRole("heading", { name: /Lost & Found notifications/i })
    ).toBeInTheDocument();
  });

  it("should NOT render Lost and Found notifications when login is local", () => {
    getRenderer();
    expect(
      queryByRole("heading", { name: /Lost & Found notifications/i })
    ).not.toBeInTheDocument();
  });

  it("should render the given lost notifications", async () => {
    getRenderer();
    expect(await findByRole("button", { name: /view/i })).toBeInTheDocument();
  });

  it("should NOT render the lost notifications when it's not provided", () => {
    getRenderer();
    expect(queryByRole("button", { name: /view/i })).not.toBeInTheDocument();
  });
});

function getRenderer() {
  return render(<AccountNotificationsIndex />);
}
