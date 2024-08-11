import { useState } from "react";
import { Link } from "react-router-dom";
import { PetCard } from "~/components/Pet/PetCard";
import {
  Button,
  ButtonProps,
  Dialog,
  LinkButton,
  Text,
} from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { AppRoutePaths } from "../AppRoutePaths";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();
  const [isLostOrFoundDialogOpen, setIsLostOrFoundDialogOpen] = useState(false);

  const lostOrFoundMessages = [
    "While many pets find their way home after a short time, many more don't.",
    "Thanks to microchips, 24Petwatch is able to help reunite 1000s of lost pets with their owners each",
  ];

  return (
    <Layout>
      <Header
        pageTitle="My Pets"
        primaryElement={renderMyPetsHeadButtons()}
        secondaryElement={renderReportLostOrFoundButton({
          className: "md:hidden w-full",
        })}
      />

      <div className="grid w-full grid-flow-row grid-cols-1 justify-center gap-large sm:grid-cols-2 lg:grid-cols-3">
        {pets.map(({ isProtected, ...rest }) => (
          <Link key={`link-${rest.id}`} to={rest.id}>
            <PetCard
              shadow="elevation-1"
              key={rest.name}
              displayProtectedBadge={{ isProtected: !!isProtected }}
              {...rest}
            >
              <div className="p-base text-2xl font-bold leading-none text-black">
                {rest.name}
              </div>
            </PetCard>
          </Link>
        ))}
      </div>

      {openReportLostOrFoundModal()}
    </Layout>
  );

  function renderReportLostOrFoundButton(
    props: Pick<ButtonProps, "className">
  ) {
    return (
      <Button
        variant="secondary"
        iconLeft="warningTriangle"
        onClick={onHandleReportLostOrFound}
        {...props}
      >
        Report a lost or found pet
      </Button>
    );
  }

  function renderMyPetsHeadButtons() {
    return (
      <div className="flex gap-small">
        {renderReportLostOrFoundButton({
          className: "hidden md:flex",
        })}
        <LinkButton
          iconLeft="add"
          to={AppRoutePaths.addNewPet}
          variant="primary"
        >
          Add a new pet
        </LinkButton>
      </div>
    );
  }

  function onHandleReportLostOrFound() {
    setIsLostOrFoundDialogOpen(true);
  }

  function renderReportLostOrFoundContent() {
    return (
      <div className="mt-large">
        {lostOrFoundMessages.map((message) => (
          <Text size="base">{message}</Text>
        ))}
        <div className="mt-xxlarge grid gap-small md:flex">
          <Button variant="secondary" fullWidth>
            I have found a pet
          </Button>
          <Button fullWidth>I have lost a pet</Button>
        </div>
      </div>
    );
  }

  function openReportLostOrFoundModal() {
    return (
      <Dialog
        align="center"
        icon="warningTriangle"
        iconProps={{
          className: "mb-xxlarge",
          size: 72,
        }}
        id="report-lost-or-found-dialog"
        isOpen={isLostOrFoundDialogOpen}
        onClose={() => setIsLostOrFoundDialogOpen(false)}
        title="Report a lost or found pet"
      >
        {renderReportLostOrFoundContent()}
      </Dialog>
    );
  }
};
