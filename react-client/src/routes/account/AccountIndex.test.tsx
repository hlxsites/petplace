import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountIndex } from "./AccountIndex";

const { getByRole, queryByRole } = screen;

jest.mock("~/util/authUtil", () => ({
  checkIsSsoEnabledLogin: jest.fn().mockReturnValue(false),
  readJwtClaim: jest.fn(),
}));

// TODO: mock the useAccountIndexViewModel hook
describe.skip("AccountIndex", () => {
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
    const { container } = getRenderer();
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
      getRenderer();
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

function getRenderer() {
  return render(<AccountIndex />);
}
