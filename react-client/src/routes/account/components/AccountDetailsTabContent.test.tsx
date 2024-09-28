import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { AccountDetailsTabContent } from "./AccountDetailsTabContent";

const { getByRole, queryByRole } = screen;

jest.mock("~/util/authUtil", () => ({
  checkIsExternalLogin: jest.fn().mockReturnValue(false),
  readJwtClaim: jest.fn(),
}));

// TODO: mock the useAccountContext hook
describe.skip("AccountDetailsTabContent", () => {
  it("should render expected 'account-details-form'", () => {
    const { container } = getRenderer();
    expect(
      container.querySelector("form[id='account-details-form']")
    ).toBeInTheDocument();
  });

  it("should NOT render 'emergency-contact-form' if login is internal", () => {
    const { container } = getRenderer();
    expect(
      container.querySelector("form[id='emergency-contact-form']")
    ).not.toBeInTheDocument();
  });

  it("should render 'emergency-contact-form' if login is external", () => {
    const { container } = getRenderer({ isExternalLogin: true });
    expect(
      container.querySelector("form[id='emergency-contact-form']")
    ).toBeInTheDocument();
  });

  it.each([/^contact info$/i, /^user details$/i])(
    "should render expected section %s title",
    (expected) => {
      getRenderer();
      expect(getByRole("heading", { name: expected })).toBeInTheDocument();
    }
  );

  it.each([/^address$/i, /^emergency contact info$/i])(
    "should NOT render %s section title",
    (expected) => {
      getRenderer();
      expect(
        queryByRole("heading", { name: expected })
      ).not.toBeInTheDocument();
    }
  );

  it.each([/^address$/i, /^emergency contact info$/i])(
    "should render %s section title when is external login",
    (expected) => {
      getRenderer({ isExternalLogin: true });
      expect(getByRole("heading", { name: expected })).toBeInTheDocument();
    }
  );

  it("should render the save button enabled when a value in the form is changed", async () => {
    getRenderer();

    expect(getByRole("button", { name: "Save changes" })).toBeDisabled();
    await userEvent.type(getByRole("textbox", { name: "First Name" }), "test");
    expect(getByRole("button", { name: "Save changes" })).toBeEnabled();
  });
});

function getRenderer({
  ...props
}: Partial<ComponentProps<typeof AccountDetailsTabContent>> = {}) {
  return render(<AccountDetailsTabContent {...props} />);
}
