import { render, screen } from "@testing-library/react";
import { MembershipHeader } from "./MembershipHeader";
import { ComponentProps } from "react";

const { getByRole, getByText } = screen;

describe("MembershipHeader", () => {
  it("should render component with petWatchLogo img with its alt attribute", () => {
    getRenderer();
    expect(getByRole("img")).toHaveAttribute("alt", "24 Pet Watch logo");
  });

  it.each(["Dino", "Piffle"])(
    "should render the title with the given petName",
    (petName) => {
      const title = `Choose a membership that's right for ${petName}`;
      getRenderer({ petName });
      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it("should render the message", () => {
    const message =
      "Unfortunately, 1 in 3 pets go missing. We know how stressful it can be when a furry family member is lost. With our lost pet memberships, we're here to help reunite lost pets with their families.";
    getRenderer();
    expect(getByText(message)).toBeInTheDocument();
  });
});

function getRenderer({
  petName = "Tina",
}: Partial<ComponentProps<typeof MembershipHeader>> = {}) {
  return render(<MembershipHeader petName={petName} />);
}
