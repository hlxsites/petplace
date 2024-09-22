import { PetAlertMessage } from "../PetAlertMessage";

type PetAlertSectionProps = {
  route?: string;
};

export const PetAlertSection = ({ route }: PetAlertSectionProps) => {
  if (!route) return null;

  return (
    <div className="pb-xxlarge">
      <PetAlertMessage
        message="Explore options for accident and illness coverage. Powered by PTZ Insurance Agency Ltd."
        route={route}
        title="Protect your pet from the unexpected!"
      />
    </div>
  );
};
