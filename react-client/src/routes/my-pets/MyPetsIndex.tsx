import { PetCard } from "~/components/Pet/PetCard";
import { Button, Title } from "~/components/design-system";
import { useMyPetsIndexViewModel } from "./useMyPetsIndexViewModel";

export const MyPetsIndex = () => {
  const { pets } = useMyPetsIndexViewModel();

  return (
    <>
      {getHeader()}

      <div className="mt-base grid w-full grid-flow-row grid-cols-1 justify-center gap-6 px-base tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4">
        {pets.map((pet) => {
          return (
            <div key={pet.name} className="flex w-full justify-center">
              <PetCard {...pet} />
            </div>
          );
        })}
      </div>
    </>
  );

  function getHeader() {
    return (
      <div className="mx-xlarge my-large tablet:mx-[0px] tablet:my-[0px]">
        <div className="flex justify-between tablet:mt-base tablet:px-base">
          <Title className="flex items-center text-xl tablet:text-2xl">
            My Pets
          </Title>
          <div className="flex">
            <Button
              variant="secondary"
              iconLeft={{
                display: "warningTriangle",
                size: 16,
                className: "mr-small",
              }}
              className="mr-small hidden h-[40px] py-[12px] text-[16px] tablet:flex"
            >
              Report a lost or found pet
            </Button>
            <Button
              iconLeft={{ display: "add", size: 16, className: "mr-small" }}
              className="h-[30px] w-[148px] px-small py-small text-[14px] tablet:h-[40px] tablet:w-auto tablet:py-[12px] tablet:text-[16px]"
            >
              Add a new pet
            </Button>
          </div>
        </div>

        <Button
          variant="secondary"
          iconLeft={{
            display: "warningTriangle",
            size: 16,
            className: "mr-small",
          }}
          className="visible mt-large h-[30px] w-full py-small text-[14px] tablet:hidden tablet:h-[40px] tablet:py-[12px] tablet:text-[16px]"
        >
          Report a lost or found pet
        </Button>
      </div>
    );
  }
};
