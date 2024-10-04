import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { IconKeys } from "../design-system";
import { PetServiceDetailsCard } from "./PetServiceDetailsCard";

const { getByText, getByRole, queryByRole } = screen;

describe("PetServiceDetailsCard", () => {
  it("should render title", () => {
    getRenderer();
    expect(getByText("Service Description:")).toBeInTheDocument();
  });

  it.each(["a description", "another description"])(
    "should render description %s",
    (expected) => {
      getRenderer({ description: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["an additional info", "another additional info"])(
    "should render additional info %s",
    (expected) => {
      getRenderer({ additionalInfo: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it.each(["71 987792331", "21 32786543"])(
    "should render contact info %s",
    (expected) => {
      getRenderer({ contact: expected });
      expect(getByText(expected)).toBeInTheDocument();
    }
  );

  it("should render primary button when primaryAction  and confirmButtonLabel are determined", () => {
    const primaryAction = {
      buttonLabel: "primary action label",
      confirmButtonLabel: "yes",
    };
    getRenderer({ primaryAction });
    expect(
      getByRole("button", { name: "primary action label" })
    ).toBeInTheDocument();
  });

  it("should NOT render primary button when primaryAction is not determined", () => {
    getRenderer({ primaryAction: undefined });
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render secondary button when secondaryActions are determined", () => {
    const secondaryActions = {
      icon: "apps" as IconKeys,
      buttonLabel: "secondary action label",
    };
    getRenderer({ secondaryActions: [secondaryActions] });
    expect(
      getByRole("button", { name: "secondary action label" })
    ).toBeInTheDocument();
  });

  it("should NOT render secondary button when secondaryActions is not determined", () => {
    getRenderer({ secondaryActions: undefined });
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should call primary action callback", async () => {
    const primaryAction = {
      buttonLabel: "action label",
      confirmButtonLabel: "yes",
      onClick: jest.fn(),
    };
    getRenderer({ primaryAction });

    await userEvent.click(
      getByRole("button", { name: primaryAction.buttonLabel })
    );
    expect(primaryAction.onClick).toHaveBeenCalled();
  });

  it("should call secondary action callback", async () => {
    const secondaryAction = {
      icon: "alert" as IconKeys,
      buttonLabel: "action label",
      onClick: jest.fn(),
    };
    getRenderer({ secondaryActions: [secondaryAction] });

    await userEvent.click(
      getByRole("button", { name: secondaryAction.buttonLabel })
    );
    expect(secondaryAction.onClick).toHaveBeenCalled();
  });

  it.each([
    [
      "Alert",
      {
        icon: "alert" as IconKeys,
        buttonLabel: "action label",
        onClick: jest.fn(),
      },
    ],
    [
      "Search",
      {
        icon: "search" as IconKeys,
        buttonLabel: "action label",
        onClick: jest.fn(),
      },
    ],
  ])(
    "should render secondary actions %s icon correctly",
    (expected, secondaryAction) => {
      getRenderer({ secondaryActions: [secondaryAction] });

      expect(
        getByRole("button", {
          name: secondaryAction.buttonLabel,
        }).querySelector("svg")
      ).toHaveAttribute("data-file-name", `Svg${expected}Icon`);
    }
  );
});

function getRenderer({
  description = "Test description",
  isModalOpen = false,
  onCloseModal = jest.fn(),
  ...props
}: Partial<ComponentProps<typeof PetServiceDetailsCard>> = {}) {
  return render(
    <PetServiceDetailsCard
      description={description}
      isModalOpen={isModalOpen}
      onCloseModal={onCloseModal}
      {...props}
    />
  );
}
