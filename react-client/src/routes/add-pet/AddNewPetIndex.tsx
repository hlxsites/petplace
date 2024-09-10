import {
  Button,
  Icon,
  IconKeys,
  Text,
  Title,
} from "~/components/design-system";
import { Card } from "~/components/design-system/card/Card";
import { Header } from "~/components/design-system/header/Header";
import { Layout } from "~/components/design-system/layout/Layout";
import { MY_PETS_FULL_ROUTE } from "../AppRoutePaths";

type CardContent = {
  button: string;
  icon: IconKeys;
  message: string;
  title: string;
};

export const AddNewPetIndex = () => {
  return (
    <Layout>
      <Header
        backButtonTo={MY_PETS_FULL_ROUTE}
        mb="small"
        pageTitle="Add new pet"
      />
      <div className="mb-[32px] w-full lg:mb-[40px]">
        <Text size="16">
          Is this a new or previously registered Pet? You have three options
          bellow:
        </Text>
      </div>
      <div className="grid max-h-[492] max-w-[800px] grid-cols-1 gap-base sm:grid-cols-2 lg:grid-cols-3">
        {getCardsContent().map((card) => {
          return (
            <div className="lg:w-[256px]">
              <Card>
                <div className="grid p-large">
                  <Icon display={card.icon} />
                  <div className="my-large grid gap-small sm:h-[88px] lg:h-auto">
                    <Title level="h4">{card.title}</Title>
                    <Text size="14">{card.message}</Text>
                  </div>

                  <Button variant="secondary" fullWidth>
                    {card.button}
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </Layout>
  );

  function getCardsContent(): CardContent[] {
    return [
      {
        button: "Get Started",
        icon: "cpuChip",
        message: "Ensure your pet is easily identifiable and traceable.",
        title: "Register a new pet with a microchip",
      },
      {
        button: "Begin Registration",
        icon: "paw",
        message: "Keep your pet's details on record without a microchip.",
        title: "Register a new pet without a microchip",
      },
      {
        button: "Transfer Now",
        icon: "transfer",
        message: "Update the ownership details for an already registered pet.",
        title: "Transfer a pet's registration",
      },
      {
        button: "Import pet",
        icon: "bendArrowDown",
        message: "You have pets on My Pet Health or DAX.",
        title: "Import existing pet",
      },
    ];
  }
};