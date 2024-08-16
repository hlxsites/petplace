import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { DocumentationStatus } from "~/mocks/MockRestApiServer";
import { getByTextContent } from "~/util/testingFunctions";
import { OnboardingDialog } from "./OnboardingDialog";

jest.mock(
  "focus-trap-react",
  () =>
    ({ children }: { children: JSX.Element }) => (
      <div data-testid="FocusTrap">{children}</div>
    )
);

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
      getByRole("heading", { name: "Welcome to PetPlace!" })
    ).toBeInTheDocument();
    expect(
      getByText(
        "Your go-to destination for keeping pets happy and healthy. Discover sound advice, trusted providers, and indispensable services all in one place."
      )
    ).toBeInTheDocument();
    expect(getByAltText("Comfy dog and cat")).toBeInTheDocument();
  });

  it("should render step 2 content", () => {
    localStorage.setItem("step", "2");
    getRenderer();

    expect(
      getByRole("heading", {
        name: "Important notice for 24Petwatch customers.",
      })
    ).toBeInTheDocument();
    expect(
      getByText(
        "Your and your pet's information has moved to PetPlace. You can now access your 24Petwatch account from PetPlace."
      )
    ).toBeInTheDocument();
    expect(getByAltText("24 Pet Watch Logo")).toBeInTheDocument();
    expect(getByAltText("Pet Place Logo")).toBeInTheDocument();
  });

  it("should render step 3 content", () => {
    localStorage.setItem("step", "3");
    getRenderer();

    expect(
      getByRole("heading", { name: "It's all about your pet!" })
    ).toBeInTheDocument();
    expect(
      getByText(
        "MyPets is where you keep track of all your pet's important stuff. Plus, recommendations on how to keep your pet protected!"
      )
    ).toBeInTheDocument();
    expect(getByAltText("Friendly dog and cat")).toBeInTheDocument();
  });

  it("should render step 4 content for none documentationStatus by default", () => {
    localStorage.setItem("step", "4");
    getRenderer();

    expect(
      getByRole("heading", {
        name: "At PetPlace you can access all your pet's adoption documents.",
      })
    ).toBeInTheDocument();
    expect(
      getByTextContent(
        "Update, add files, download, or print. It's the one place to keep all your pet's details. If available, would you like PetPlace to access and upload Romã's shelter documents for you?"
      )
    ).toBeInTheDocument();
    expect(
      getByAltText("Icons representing available pet services")
    ).toBeInTheDocument();
  });

  it.each([
    [
      "sent",
      "Uploading...",
      "Your pet’s documents are being processed. Please wait a moment while we complete the upload.",
    ],
    [
      "approved",
      "Upload Successful!",
      "Your pet’s documents have been uploaded successfully and are now available.",
    ],
    [
      "in progress",
      "Upload In Progress",
      "Your pet’s documents are being uploaded. They will be available within 24 hours.",
    ],
    [
      "failed",
      "Upload Failed",
      "There was an issue uploading your pet’s documents. Please try again or upload them manually.",
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

  it("should render step 5 content", () => {
    localStorage.setItem("step", "5");
    getRenderer();

    expect(getByRole("heading", { name: "Almost there!" })).toBeInTheDocument();
    expect(
      getByText(
        "Your pet's microchip is registered. Now let’s ensure your pet's safety with added layers of protection."
      )
    ).toBeInTheDocument();
    expect(getByText("Microchip registration")).toBeInTheDocument();
    expect(getByText("Digital documents")).toBeInTheDocument();
    expect(getByText("Enhanced pet protection")).toBeInTheDocument();
  });
});

function getRenderer({
  documentationStatus = "none",
  id = "test-id",
  name = "Romã",
}: Partial<ComponentProps<typeof OnboardingDialog>> = {}) {
  return render(
    <OnboardingDialog
      id={id}
      name={name}
      documentationStatus={documentationStatus}
    />
  );
}
