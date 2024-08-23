import { render, screen } from "@testing-library/react";
import { PetServiceAdditionalInfo } from "./PetServiceAdditionalInfo";
import { ComponentProps } from "react";
import { Title } from "../design-system";

const { getByText, getByRole } = screen;

describe("PetServiceAdditionalInfo", () => {
  it.each(["My amazing label", "Awesome label"])(
    "should render the given text",
    (info) => {
      getRenderer({ info });
      expect(getByText(info));
    }
  );

  it("should render the given element", () => {
    getRenderer({ info: <Title>Random title</Title> });
    expect(getByRole("heading", { name: "Random title" })).toBeInTheDocument();
  });
});

function getRenderer({
  info,
}: ComponentProps<typeof PetServiceAdditionalInfo>) {
  return render(<PetServiceAdditionalInfo info={info} />);
}
