import { render, screen } from "@testing-library/react";
import { ChangePassword } from "./ChangePassword";
import { ComponentProps } from "react";
import { userEvent } from "@testing-library/user-event";

const { getByRole, getByText } = screen;

const CHANGE_PASSWORD_LABEL = /change password/i;

describe("ChangePassword", () => {
  it("should render component with role region", () => {
    getRenderer();
    expect(getByRole("region")).toBeInTheDocument();
  });

  it("should render component with its title", () => {
    getRenderer();
    expect(getByRole("heading")).toHaveTextContent(CHANGE_PASSWORD_LABEL);
  });

  it("should render component with its text message", () => {
    getRenderer();
    expect(getByText(/Create new account password/i)).toBeInTheDocument();
  });

  it("should render component with its button", () => {
    getRenderer();
    expect(
      getByRole("button", { name: CHANGE_PASSWORD_LABEL })
    ).toBeInTheDocument();
  });

  it("should call onChangePassword callback when user clicks on the button", async () => {
    const onChangePassword = jest.fn();
    getRenderer({ onChangePassword });

    expect(onChangePassword).not.toHaveBeenCalled();

    await userEvent.click(getByRole("button", { name: CHANGE_PASSWORD_LABEL }));
    expect(onChangePassword).toHaveBeenCalledTimes(1);
  });

  it("should render component with expected classes to assure that will work on multiple screens", () => {
    getRenderer();
    expect(getByRole("region").querySelector("div")).toHaveClass(
      "grid grid-cols-1 lg:flex"
    );
  });
});

function getRenderer({
  ...props
}: Partial<ComponentProps<typeof ChangePassword>> = {}) {
  return render(<ChangePassword {...props} />);
}
