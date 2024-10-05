import { Link } from "react-router-dom";
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
import { redirectToLostPet } from "~/util/forceRedirectUtil";
import { AppRoutePaths } from "../AppRoutePaths";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();

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
            {pets.map(({ id, isProtected, name, img }) => (
              <Link className="no-underline" key={id} to={id}>
                <PetCard
                  displayProtectedBadge={{ isProtected: !!isProtected }}
                  key={name}
                  name={name}
                  shadow="elevation-1"
                  variant="md"
                  img={img}
                >
                  <div className="text-2xl p-base font-bold leading-none text-black">
                    <Title level="h3">{name}</Title>
                  </div>
                </PetCard>
              </Link>
            ))}
          </div>
        )}
      </SuspenseAwait>
    </Layout>
  );

  function renderReportLostOrFoundButton(
    props: Pick<ButtonProps, "className">
  ) {
    return (
      <Button
        variant="secondary"
        iconLeft="warningTriangle"
        onClick={redirectToLostPet}
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
};
