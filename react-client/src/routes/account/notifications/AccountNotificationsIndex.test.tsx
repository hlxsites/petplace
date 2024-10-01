import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentProps } from "react";
import { LostPetUpdateModel } from "~/domain/models/user/UserModels";
import { AccountNotificationsIndex } from "./AccountNotificationsIndex";

jest.mock("~/util/authUtil", () => ({
  readJwtClaim: jest.fn(),
  checkIsExternalLogin: jest.fn(),
}));

const { getByRole, queryByRole, findByRole } = screen;

// TODO: This shouldn't be needed after refactoring how to handle account form
jest.mock("~/util/authUtil", () => ({
  checkIsExternalLogin: jest.fn().mockReturnValue(false),
}));

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

  it("should render the given lost notifications", async () => {
    getRenderer({
      isExternalLogin: true,
      lostPetsHistory: Promise.resolve(MOCK_PET_HISTORY),
    });
    expect(await findByRole("button", { name: /view/i })).toBeInTheDocument();
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
}: Partial<ComponentProps<typeof AccountNotificationsIndex>> = {}) {
  return render(<AccountNotificationsIndex {...props} />);
}

const MOCK_PET_HISTORY: LostPetUpdateModel[] = [
  {
    communicationId: "sample-id",
    date: 628021800000,
    foundedBy: {
      finderName: "Mrs Smart",
    },
    id: "0",
    petId: "AUN19623620",
    petName: "Mag",
    status: "missing",
    update: 0,
  },
];
