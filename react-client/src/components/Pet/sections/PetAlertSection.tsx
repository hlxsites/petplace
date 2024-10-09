import { PetAlertMessage } from "../PetAlertMessage";

type PetAlertSectionProps = {
  route?: string;
};

export const PetAlertSection = ({ route }: PetAlertSectionProps) => {
  if (!route) return null;

  return (
    <div className="pb-xxlarge">
      <PetAlertMessage
        message="It is stressful when a furry family member is lost. Protect and care for your pet with 24Petwatch enhanced  Lost Pet Protection. [1] The importance of pet identification and what to do if you lose (or find) a pet"
        route={route}
        title="Did you know that 1 in 3 pets go missing?"
      />
    </div>
  );
};
