import { AppRoutePaths } from "~/routes/AppRoutePaths";
import { Dialog, DialogTrigger, LinkButton, Text } from "../design-system";

type LostOrFoundDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  trigger: DialogTrigger;
};

export const LostOrFoundDialog = (props: LostOrFoundDialogProps) => {
  return (
    <Dialog
      align="center"
      icon="warningTriangle"
      iconProps={{
        className: "mb-xxlarge",
        size: 72,
      }}
      id="report-lost-or-found-dialog"
      title="Report a lost or found pet"
      width={708}
      {...props}
    >
      {renderReportLostOrFoundContent()}
    </Dialog>
  );

  function renderReportLostOrFoundContent() {
    const messages = [
      "While many pets find their way home after a short time, many more don't.",
      "Thanks to microchips, 24Petwatch is able to help reunite 1000s of lost pets with their owners each",
    ];

    return (
      <div className="mt-large">
        {messages.map((message) => (
          <Text key={message} size="16">
            {message}
          </Text>
        ))}
        <div className="flex-rol mt-xxlarge flex flex-col gap-small md:flex-row">
          <LinkButton
            fullWidth
            to={`/${AppRoutePaths.foundPet}`}
            variant="secondary"
          >
            I have found a pet
          </LinkButton>
          <LinkButton
            fullWidth
            to={`/${AppRoutePaths.lostPet}`}
            variant="primary"
          >
            I have lost a pet
          </LinkButton>
        </div>
      </div>
    );
  }
};
