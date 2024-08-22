import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PET_WATCH_OPTIONS } from "~/routes/my-pets/:petId/utils/petWatchConstants";
import { PetWatchDrawerBody } from "./PetWatchDrawerBody";

const { getByText } = screen;

const DEFAULT_CONTENT = {
  title: "Test title",
  subtitle: "Test subtitle",
  description: "Test description",
};

const PET_WATCH_OPTIONS_LABELS = PET_WATCH_OPTIONS.map(({ label }) => label);

describe("PetWatchDrawerBody", () => {
  it.each(PET_WATCH_OPTIONS_LABELS)(
    "should render option %s by default",
    (expected) => {
      getRenderer();
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render service details when selected", () => {
    getRenderer({ contentDetails: DEFAULT_CONTENT });
    expect(getByText(DEFAULT_CONTENT.description)).toBeInTheDocument();
  });
});

function getRenderer({
  onClick = jest.fn(),
  ...props
}: Partial<ComponentProps<typeof PetWatchDrawerBody>> = {}) {
  return render(<PetWatchDrawerBody onClick={onClick} {...props} />);
}
