import { useState } from "react";
import { Button, Dialog, Text } from "~/components/design-system";

export const DialogPlayground = () => {
  const [isOpen, setIsOpen] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-base">
      {renderOpenDrawerButton("Open basic dialog", "basic")}
      <Dialog
        id="basic"
        isOpen={isOpen === "basic"}
        onClose={() => setIsOpen(null)}
        title="The dialog title"
      >
        <Text>
          Ut error enim. Modi qui voluptates quibusdam aliquid repudiandae nulla
          autem. Consequatur incidunt unde quis at et quis hic sed veniam.
          Voluptatem et possimus consequatur sapiente officiis qui. Omnis qui
          eaque asperiores sed earum incidunt.
        </Text>
        <Text>
          At dolores alias temporibus tempora mollitia quo. Similique ut iusto
          occaecati eveniet excepturi. Sint ut pariatur ex dolores perferendis.
          Dolorum vel voluptatibus voluptas dolores. Dolores consequatur
          inventore magni. Ad nesciunt commodi neque non quibusdam. Molestiae
          exercitationem distinctio et nemo et quia. Sunt unde velit mollitia
          quaerat.
        </Text>
      </Dialog>

      {renderOpenDrawerButton("Open fullwidth dialog", "fullwidth")}
      <Dialog
        id="fullwidth"
        fullWidth
        isOpen={isOpen === "fullwidth"}
        onClose={() => setIsOpen(null)}
        title="The fullwidth dialog"
      >
        <Text>
          Ut error enim. Modi qui voluptates quibusdam aliquid repudiandae nulla
          autem. Consequatur incidunt unde quis at et quis hic sed veniam.
          Voluptatem et possimus consequatur sapiente officiis qui. Omnis qui
          eaque asperiores sed earum incidunt.
        </Text>
        <Text>
          At dolores alias temporibus tempora mollitia quo. Similique ut iusto
          occaecati eveniet excepturi. Sint ut pariatur ex dolores perferendis.
          Dolorum vel voluptatibus voluptas dolores. Dolores consequatur
          inventore magni. Ad nesciunt commodi neque non quibusdam. Molestiae
          exercitationem distinctio et nemo et quia. Sunt unde velit mollitia
          quaerat.
        </Text>
      </Dialog>

      {renderOpenDrawerButton("Open scrollable dialog", "scrollable")}
      <Dialog
        id="scrollable"
        isOpen={isOpen === "scrollable"}
        onClose={() => setIsOpen(null)}
        title="The scrollable dialog"
      >
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Eu ipsum nostrud et do fugiat. Eiusmod eiusmod do aute elit nisi qui
          excepteur elit do consectetur culpa occaecat voluptate ea. Id occaecat
          dolore est ad id irure sint cupidatat. Fugiat velit nisi duis ad
          commodo do adipisicing. Exercitation nulla adipisicing proident
          officia mollit mollit ipsum esse consequat consectetur consectetur
          anim commodo commodo. Est velit incididunt eu deserunt eu aliquip.
          Irure nisi nostrud eiusmod qui do. Irure duis sunt proident
          reprehenderit nulla. Occaecat aute nostrud est sunt sit. Pariatur esse
          aliquip nisi consectetur. Nisi incididunt et officia aliquip est anim
          magna elit tempor aute in. Est et quis sit enim. Sit adipisicing
          ullamco pariatur voluptate aute cupidatat deserunt.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
        <Text>
          Occaecat dolore consectetur fugiat ut consequat est tempor id.
          Proident sit aliquip mollit sunt et labore qui irure ipsum eu
          reprehenderit aute. Adipisicing Lorem dolor exercitation veniam ad
          laborum amet mollit consequat veniam et labore nisi. Laborum velit do
          laborum adipisicing sint nostrud sunt ex quis culpa. Duis enim
          incididunt pariatur in ut qui aliquip aute voluptate anim.
        </Text>
        <Text>
          Aliqua esse pariatur sint nulla pariatur qui do non nulla adipisicing
          aliquip aute. Ut tempor non irure duis consequat enim occaecat tempor
          nostrud mollit elit. Eiusmod consequat aute elit deserunt laborum sunt
          eiusmod veniam excepteur est ea cupidatat fugiat nisi ex. Magna cillum
          non tempor excepteur quis veniam nostrud minim esse. Tempor occaecat
          et Lorem fugiat exercitation magna minim incididunt aliqua magna enim.
        </Text>
      </Dialog>
    </div>
  );

  function renderOpenDrawerButton(children: string, drawerId: string) {
    return (
      <Button
        aria-controls={drawerId}
        aria-haspopup="dialog"
        aria-expanded={isOpen === drawerId}
        onClick={() => setIsOpen(drawerId)}
        variant="secondary"
      >
        {children}
      </Button>
    );
  }
};
