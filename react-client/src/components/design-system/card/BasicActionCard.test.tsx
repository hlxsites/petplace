import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { BasicActionCard } from "./BasicActionCard";

const { getByRole, getByText } = screen;

describe("BasicActionCard", () => {
  it("should render component with expected role", () => {
    getRenderer();
    expect(getByRole("region")).toBeInTheDocument();
  });

  it.each(["Random title", "Amazing title"])(
    "should render the given title",
    (title) => {
      getRenderer({ title });
      expect(getByRole("heading", { name: title })).toBeInTheDocument();
    }
  );

  it.each(["Random message", "Amazing message"])(
    "should render the given message",
    (message) => {
      getRenderer({ message });
      expect(getByText(message)).toBeInTheDocument();
    }
  );

  it.each(["Random label", "Amazing label"])(
    "should render the given button label",
    (buttonLabel) => {
      getRenderer({ buttonLabel });
      expect(getByRole("link", { name: buttonLabel })).toBeInTheDocument();
    }
  );

  it.each(["/random", "/amazing"])(
    "should render the given button link",
    (buttonLink) => {
      getRenderer({ buttonLink });
      expect(getByRole("link")).toHaveAttribute("href", buttonLink);
    }
  );
});

function getRenderer({
  buttonLabel = "Test button label",
  buttonLink = "/something",
  ...rest
}: Partial<ComponentProps<typeof BasicActionCard>> = {}) {
  return render(
    <MemoryRouter>
      <BasicActionCard
        {...rest}
        buttonLabel={buttonLabel}
        buttonLink={buttonLink}
      />
    </MemoryRouter>
  );
}
