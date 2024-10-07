import { render, screen, waitFor } from "@testing-library/react";
import { ComponentProps } from "react";
import { DocumentationStatus } from "~/domain/models/pet/PetModel";
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

jest.mock("../usePetProfileLayoutViewModel", () => ({
  usePetProfileLayoutViewModel: jest.fn(),
  usePetProfileContext: jest.fn(),
}));

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

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should render Dialog with initial content", async () => {
    localStorage.setItem("step", "1");
    await getRenderer({
      name: DEFAULT_NAME,
      documentationStatus: "none",
    });

    await waitFor(() =>
      expect(
        getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[1].title })
      ).toBeInTheDocument()
    );
    expect(getByText(ONBOARDING_STEPS_TEXTS[1].message)).toBeInTheDocument();
    expect(getByAltText(ONBOARDING_STEPS_TEXTS[1].imgAlt)).toBeInTheDocument();
  });

  it("should render step 2 content", async () => {
    localStorage.setItem("step", "2");
    await getRenderer({
      name: DEFAULT_NAME,
      documentationStatus: "none",
    });

    await waitFor(() =>
      expect(
        getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[2].title })
      ).toBeInTheDocument()
    );
    expect(getByText(ONBOARDING_STEPS_TEXTS[2].message)).toBeInTheDocument();
    expect(
      getByAltText(ONBOARDING_STEPS_TEXTS[2].imgAlt24Pet)
    ).toBeInTheDocument();
    expect(
      getByAltText(ONBOARDING_STEPS_TEXTS[2].imgAltPetPlace)
    ).toBeInTheDocument();
  });

  it("should render step 3 content", async () => {
    localStorage.setItem("step", "3");
    await getRenderer({
      name: DEFAULT_NAME,
      documentationStatus: "none",
    });

    await waitFor(() =>
      expect(
        getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[3].title })
      ).toBeInTheDocument()
    );
    expect(getByText(ONBOARDING_STEPS_TEXTS[3].message)).toBeInTheDocument();
    expect(getByAltText(ONBOARDING_STEPS_TEXTS[3].imgAlt)).toBeInTheDocument();
  });

  it("should render step 4 content for none documentationStatus by default", async () => {
    localStorage.setItem("step", "4");
    await getRenderer({
      name: DEFAULT_NAME,
      documentationStatus: "none",
    });

    const [string1, string2] =
      ONBOARDING_STEPS_TEXTS[4].none.message(DEFAULT_NAME);

    await waitFor(() =>
      expect(
        getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[4].none.title })
      ).toBeInTheDocument()
    );
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
      "inProgress",
      ONBOARDING_STEPS_TEXTS[4].inProgress.title,
      ONBOARDING_STEPS_TEXTS[4].inProgress.message,
    ],
    [
      "failed",
      ONBOARDING_STEPS_TEXTS[4].failed.title,
      ONBOARDING_STEPS_TEXTS[4].failed.message,
    ],
  ] satisfies [DocumentationStatus, string, string][])(
    "should render step 4 dynamic content for documentationStatus %s",
    async (documentationStatus, title, description) => {
      localStorage.setItem("step", "4");
      await getRenderer({
        name: DEFAULT_NAME,
        documentationStatus,
      });

      await waitFor(() =>
        expect(getByRole("heading", { name: title })).toBeInTheDocument()
      );
      expect(getByText(description)).toBeInTheDocument();
    }
  );

  it("should render step 5 content with status none message", async () => {
    localStorage.setItem("step", "5");
    await getRenderer({
      name: DEFAULT_NAME,
      documentationStatus: "none",
    });

    await waitFor(() =>
      expect(
        getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[5].title })
      ).toBeInTheDocument()
    );
    expect(
      getByText(ONBOARDING_STEPS_TEXTS[5].message("none"))
    ).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].microchip)).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].documents)).toBeInTheDocument();
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].protection)).toBeInTheDocument();
  });

  it.each([
    "sent",
    "approved",
    "inProgress",
    "failed",
  ] satisfies DocumentationStatus[])(
    "should render step 5 content with message for other status",
    async (expected) => {
      localStorage.setItem("step", "5");
      await getRenderer({
        name: DEFAULT_NAME,
        documentationStatus: expected,
      });

      await waitFor(() =>
        expect(
          getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[5].title })
        ).toBeInTheDocument()
      );
      expect(
        getByText(ONBOARDING_STEPS_TEXTS[5].message(expected))
      ).toBeInTheDocument();
      expect(
        getByText(ONBOARDING_STEPS_TEXTS[5].microchip)
      ).toBeInTheDocument();
      expect(
        getByText(ONBOARDING_STEPS_TEXTS[5].documents)
      ).toBeInTheDocument();
      expect(
        getByText(ONBOARDING_STEPS_TEXTS[5].protection)
      ).toBeInTheDocument();
    }
  );
});

async function getRenderer(
  pet: ComponentProps<typeof OnboardingDialog>["pet"]
) {
  render(<OnboardingDialog pet={pet} />);
  await waitFor(() => {
    expect(getByRole("heading")).toBeInTheDocument();
  });
}
