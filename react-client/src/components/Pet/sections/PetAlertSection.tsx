import ExternalLink from "~/components/design-system/anchor/ExternalLink";
import { PetAlertMessage } from "../PetAlertMessage";

type PetAlertSectionProps = {
  route?: string;
};

export const PetAlertSection = ({ route }: PetAlertSectionProps) => {
  if (!route) return null;
  const alertLink =
    "https://www.animalhumanesociety.org/resource/importance-pet-identification-and-what-do-if-you-lose-or-find-pet#:~:text=It%27s%20estimated%20that%20one%20in,won%27t%20make%20it%20home";

  return (
    <div className="pb-xxlarge">
      <PetAlertMessage
        message={
          <>
            It is stressful when a furry family member is lost. Protect and care
            for your pet with 24Petwatch enhanced Lost Pet Protection.{" "}
            <ExternalLink href={alertLink}>
              [1] The importance of pet identification and what to do if you
              lose (or find) a pet
            </ExternalLink>
          </>
        }
        route={route}
        title="Did you know that 1 in 3 pets go missing?"
      />
    </div>
  );
};
