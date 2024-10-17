import { render, screen, waitFor } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import {
  DocumentationStatus,
  PetInAdoptionList,
} from "~/domain/models/pet/PetModel";
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

const DEFAULT_PET: PetInAdoptionList = {
  id: "bob",
  isCheckoutAvailable: true,
  name: "Bob",
  isProfileAvailable: true,
};

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
    localStorage.setItem("onboarding-step", "1");
    await getRenderer({
      pet: DEFAULT_PET,
      status: "none",
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
    localStorage.setItem("onboarding-step", "2");
    await getRenderer({
      pet: DEFAULT_PET,
      status: "none",
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
    localStorage.setItem("onboarding-step", "3");
    await getRenderer({
      pet: DEFAULT_PET,
      status: "none",
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
    localStorage.setItem("onboarding-step", "4");
    await getRenderer({
      pet: DEFAULT_PET,
      status: "none",
    });

    const [string1, string2] = ONBOARDING_STEPS_TEXTS[4].none.message("Bob");

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
    async (status, title, description) => {
      localStorage.setItem("onboarding-step", "4");
      await getRenderer({
        pet: DEFAULT_PET,
        status,
      });

      await waitFor(() =>
        expect(getByRole("heading", { name: title })).toBeInTheDocument()
      );
      expect(getByText(description)).toBeInTheDocument();
    }
  );

  it("should render step 5 content with status none message", async () => {
    localStorage.setItem("onboarding-step", "5");
    await getRenderer({
      pet: DEFAULT_PET,
      status: "none",
    });

    await waitFor(() =>
      expect(
        getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[5].title })
      ).toBeInTheDocument()
    );
    expect(getByText(ONBOARDING_STEPS_TEXTS[5].message)).toBeInTheDocument();
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
      localStorage.setItem("onboarding-step", "5");
      await getRenderer({
        pet: DEFAULT_PET,
        status: expected,
      });

      await waitFor(() =>
        expect(
          getByRole("heading", { name: ONBOARDING_STEPS_TEXTS[5].title })
        ).toBeInTheDocument()
      );
      expect(getByText(ONBOARDING_STEPS_TEXTS[5].message)).toBeInTheDocument();
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

async function getRenderer({
  onFinish = jest.fn(),
  onSubmitConsent = jest.fn(),
  pet = null,
  status = "none",
}: Partial<ComponentProps<typeof OnboardingDialog>> = {}) {
  render(
    <MemoryRouter>
      <OnboardingDialog
        onFinish={onFinish}
        onSubmitConsent={onSubmitConsent}
        pet={pet}
        status={status}
      />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(getByRole("heading")).toBeInTheDocument();
  });
}
