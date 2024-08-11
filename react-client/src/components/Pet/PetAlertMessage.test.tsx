import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PetAlertMessage } from "./PetAlertMessage";
import userEvent from "@testing-library/user-event";

const { getByRole, getAllByRole } = screen;

describe("AlertMessage", () => {
  it("should render the component with the correct icon", () => {
    getRenderer();

    expect(document.querySelector("svg")).toHaveAttribute(
      "data-file-name",
      "SvgStethoscopeIcon"
    );
  });

  it("should render the title of the alert message", () => {
    getRenderer();

    expect(
      getByRole("heading", { name: /Secure Your Pet's Future/i })
    ).toBeInTheDocument();
  });

  it.each(["Drake", "Jason"])(
    "should render the message of the alert message with pet's name",
    (petName) => {
      getRenderer({ petName });

      expect(getByRole("paragraph")).toHaveTextContent(
        `Get a personalized insurance quote and ensure the best care for ${petName}`
      );
    }
  );

  it("should render top action button only for large screens", () => {
    getRenderer();

    const buttons = getAllByRole("button", { name: /Get Quote Now/i });
    expect(buttons[0]).toHaveClass("hidden lg:flex");
  });

  it("should render lower action button when only for medium or small screens", () => {
    getRenderer();

    const buttons = getAllByRole("button", { name: /Get Quote Now/i });
    expect(buttons[1]).toHaveClass("lg:hidden");
  });

  it("should call onClick when user clicks on action button", async () => {
    const onClick = jest.fn();
    getRenderer({ onClick });

    const buttons = getAllByRole("button", { name: /Get Quote Now/i });

    expect(onClick).not.toHaveBeenCalled();
    await userEvent.click(buttons[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

function getRenderer({
  onClick,
  petName = "Test",
}: Partial<ComponentProps<typeof PetAlertMessage>> = {}) {
  return render(<PetAlertMessage petName={petName} onClick={onClick} />);
}
