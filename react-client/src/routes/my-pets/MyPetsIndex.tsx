import { useState } from "react";
import { Link } from "react-router-dom";
import { LostOrFoundDialog } from "~/components/Pet/LostOrFoundDialog";
import { PetCard } from "~/components/Pet/PetCard";
import { SuspenseAwait } from "~/components/await/SuspenseAwait";
import {
  Button,
  ButtonProps,
  LinkButton,
  Title,
} from "~/components/design-system";
import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { IS_DEV_ENV } from "~/util/envUtil";
import { AppRoutePaths } from "../AppRoutePaths";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();
  const [isLostOrFoundDialogOpen, setIsLostOrFoundDialogOpen] = useState(false);

  return (
    <Layout>
      <Header
        pageTitle="My Pets"
        primaryElement={renderMyPetsHeadButtons()}
        secondaryElement={renderReportLostOrFoundButton({
          className: "md:hidden w-full",
        })}
      />
      <SuspenseAwait minHeight={336} resolve={pets}>
        {(pets) => (
          <div className="grid w-full grid-flow-row grid-cols-1 justify-center gap-large sm:grid-cols-2 lg:grid-cols-3">
            {pets.map(({ isProtected, ...rest }) => (
              <Link className="no-underline" key={rest.id} to={rest.id}>
                <PetCard
                  displayProtectedBadge={{ isProtected: !!isProtected }}
                  key={rest.name}
                  shadow="elevation-1"
                  variant="md"
                  {...rest}
                >
                  <div className="text-2xl p-base font-bold leading-none text-black">
                    <Title level="h3">{rest.name}</Title>
                  </div>
                </PetCard>
              </Link>
            ))}
          </div>
        )}
      </SuspenseAwait>
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
        {IS_DEV_ENV && (
          <LinkButton
            iconLeft="add"
            to={AppRoutePaths.addNewPet}
            variant="primary"
          >
            Add a new pet
          </LinkButton>
        )}
      </div>
    );
  }

  function onHandleReportLostOrFound() {
    setIsLostOrFoundDialogOpen(true);
  }

  function openReportLostOrFoundModal() {
    return (
      <LostOrFoundDialog
        isOpen={isLostOrFoundDialogOpen}
        onClose={() => setIsLostOrFoundDialogOpen(false)}
      />
    );
  }
};
