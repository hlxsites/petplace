import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { DocumentationStatus } from "~/mocks/MockRestApiServer";
import { getByTextContent } from "~/util/testingFunctions";
import { OnboardingDialog } from "./OnboardingDialog";
import { ONBOARDING_STEPS_TEXTS } from "./onboardingTexts";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

const DEFAULT_NAME = "Romã";

const { getByRole, getByText, getByAltText } = screen;

describe("OnboardingDialog", () => {
  beforeEach(() => {
    const store: { [key: string]: string } = {};
    jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation((key) => store[key]);
    jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation((key, value) => {
        store[key] = value.toString();
      });
  });

  it("should render Dialog with initial content", () => {
    getRenderer();

    expect(
      getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[1].title })
    ).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[1].message)).toBeInTheDocument();
    expect(getByAltText(ONBOARDING_STEPS_TEXTS[1].imgAlt)).toBeInTheDocument();
  });

  it("should render step 2 content", () => {
    localStorage.setItem("step", "2");
    getRenderer();

    expect(
      getByRole("heading", {
        name: ONBOARDING_STEPS_TEXTS[2].title,
      })
    ).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[2].message)).toBeInTheDocument();
    expect(
      getByAltText(ONBOARDING_STEPS_TEXTS[2].imgAlt24Pet)
    ).toBeInTheDocument();
    expect(
      getByAltText(ONBOARDING_STEPS_TEXTS[2].imgAltPetPlace)
    ).toBeInTheDocument();
  });

  it("should render step 3 content", () => {
    localStorage.setItem("step", "3");
    getRenderer();

    expect(
      getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[3].title })
    ).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[3].message)).toBeInTheDocument();
    expect(getByAltText(ONBOARDING_STEPS_TEXTS[3].imgAlt)).toBeInTheDocument();
  });

  it("should render step 4 content for none documentationStatus by default", () => {
    localStorage.setItem("step", "4");
    getRenderer();

    const [string1, string2] =
      ONBOARDING_STEPS_TEXTS[4].none.message(DEFAULT_NAME);

    expect(
      getByRole("heading", {
        name: ONBOARDING_STEPS_TEXTS[4].none.title,
      })
    ).toBeInTheDocument();
    expect(getByTextContent(`${string1}${string2}`)).toBeInTheDocument();
    expect(
      getByAltText(ONBOARDING_STEPS_TEXTS[4].none.imgAlt)
    ).toBeInTheDocument();
  });

  it.each([
    [
      "sent",
      ONBOARDING_STEPS_TEXTS[4].sent.title,
      ONBOARDING_STEPS_TEXTS[4].sent.message,
    ],
    [
      "approved",
      ONBOARDING_STEPS_TEXTS[4].approved.title,
      ONBOARDING_STEPS_TEXTS[4].approved.message,
    ],
    [
      "in progress",
      ONBOARDING_STEPS_TEXTS[4]["in progress"].title,
      ONBOARDING_STEPS_TEXTS[4]["in progress"].message,
    ],
    [
      "failed",
      ONBOARDING_STEPS_TEXTS[4].failed.title,
      ONBOARDING_STEPS_TEXTS[4].failed.message,
    ],
  ])(
    "should render step 4 dynamic content for documentationStatus %s",
    (documentationStatus, title, description) => {
      localStorage.setItem("step", "4");
      getRenderer({
        documentationStatus: documentationStatus as DocumentationStatus,
      });

      expect(getByRole("heading", { name: title })).toBeInTheDocument();
      expect(getByText(description)).toBeInTheDocument();
    }
  );

  it("should render step 5 content with status none message", () => {
    localStorage.setItem("step", "5");
    getRenderer();

    expect(
      getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[5].title })
    ).toBeInTheDocument();
    expect(
      getByText(ONBOARDING_STEPS_TEXTS[5].message("none"))
    ).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].microchip)).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].documents)).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].protection)).toBeInTheDocument();
  });

  it("should render step 5 content with message for other status", () => {
    localStorage.setItem("step", "5");
    getRenderer({ documentationStatus: "approved" });

    expect(
      getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[5].title })
    ).toBeInTheDocument();
    expect(
      getByText(ONBOARDING_STEPS_TEXTS[5].message("approved"))
    ).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].microchip)).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].documents)).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].protection)).toBeInTheDocument();
  });
});

function getRenderer({
  documentationStatus = "none",
  id = "test-id",
  name = DEFAULT_NAME,
}: Partial<ComponentProps<typeof OnboardingDialog>> = {}) {
  return render(
    <OnboardingDialog
      id={id}
      name={name}
      documentationStatus={documentationStatus}
    />
  );
}
