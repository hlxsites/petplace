import { PetServiceDetailsCard } from "~/components/Pet/PetServiceDetailsCard";
import { PET_WATCH_SERVICES_DETAILS } from "~/routes/my-pets/:petId/utils/petServiceDetails";

export const PetServicesDetailsPlayground = () => {
  return (
    <div className="flex flex-col gap-xlarge">
      {PET_WATCH_SERVICES_DETAILS.map((service) => (
        <PetServiceDetailsCard key={service.title} {...service} />
      ))}
    </div>
  );
};
