import { render, screen } from "@testing-library/react";
import { ViewNotifications } from "./ViewNotifications";
import { ComponentProps } from "react";

const { getByText, getByRole } = screen;

describe("ViewNotifications", () => {
  it.each(["Barb", "Thomas"])(
    "should render the given petName=%s",
    (petName) => {
      getRenderer({ petName });
      expect(
        getByText(`Pet ${petName} is found by Jane Doe`)
      ).toBeInTheDocument();
    }
  );

  it.each(["Janet", "Paul"])(
    "should render the given foundedBy=%s",
    (foundedBy) => {
      getRenderer({ foundedBy });
      expect(
        getByText(`Pet Juan is found by ${foundedBy}`)
      ).toBeInTheDocument();
    }
  );

  it.each(["06-10-2024", "06-10-2021"])(
    "should render the given dateFoundOrLost=%s",
    (dateFoundOrLost) => {
      getRenderer({ dateFoundOrLost });
      expect(getByText(`${dateFoundOrLost} | FoundPet`)).toBeInTheDocument();
    }
  );

  it.each(["LostPet", "FoundPet"] as ComponentProps<
    typeof ViewNotifications
  >["notificationCategory"][])(
    "should render the given notificationCategory=%s",
    (notificationCategory) => {
      getRenderer({ notificationCategory });
      expect(
        getByText(`06-10-2024 | ${notificationCategory}`)
      ).toBeInTheDocument();
    }
  );

  it("should render button with expected icon and label", () => {
    getRenderer();
    expect(
      document.querySelector("svg[data-file-name='SvgEyeIcon']")
    ).toBeInTheDocument();
    expect(getByRole("button", { name: /View/i })).toBeInTheDocument();
  });

  it("should render button with expected classes", () => {
    getRenderer();

    expect(getByRole("button", { name: /View/i }).parentElement).toHaveClass(
      "pt-medium lg:pt-0 justify-end"
    );
  });
});

function getRenderer({
  dateFoundOrLost = "06-10-2024",
  foundedBy = "Jane Doe",
  notificationCategory = "FoundPet",
  petName = "Juan",
  ...rest
}: Partial<ComponentProps<typeof ViewNotifications>> = {}) {
  return render(
    <ViewNotifications
      dateFoundOrLost={dateFoundOrLost}
      foundedBy={foundedBy}
      notificationCategory={notificationCategory}
      petName={petName}
      {...rest}
    />
  );
}
