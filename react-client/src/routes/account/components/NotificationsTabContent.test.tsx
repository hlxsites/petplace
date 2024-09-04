import { render, screen } from "@testing-library/react";
import { NotificationsTabContent } from "./NotificationsTabContent";
import { userEvent } from "@testing-library/user-event";

const { getByRole } = screen;

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
});

function getRenderer() {
  return render(<NotificationsTabContent />);
}
