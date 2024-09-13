import { useState } from "react";
import {
  Button,
  DisplayForm,
  FormSchema,
  FormValues,
  Tab,
  Tabs,
} from "~/components/design-system";

type CommonForm = {
  name: string;
  breed: string;
  gender: string;
  "health-problems": string[];
  vaccine: true;
  comments: string;
  contact: string;
};

type Repeater = {
  "first-name": string;
  "last-name": string;
  "email-address": string;
  "contact-phone": string;
};

type RepeaterForm = {
  "test-repeater": Repeater[];
};

export const FormBuilderPlayground = () => {
  const formTabOptions: Tab[] = [
    {
      content: () => <RepeaterForm />,
      label: "Repeater form",
    },
    {
      content: () => <CommonForm />,
      label: "Common form",
    },
  ];
  const [selectedTab, setSelectedTab] = useState(formTabOptions[0].label);

  return (
    <Tabs
      onChange={onChangeSelectedTab}
      tabs={formTabOptions}
      value={selectedTab}
    />
  );

  function onChangeSelectedTab(newSelectedTab: string) {
    const tab = formTabOptions.find(({ label }) => label === newSelectedTab);
    if (tab) setSelectedTab(tab.label);
  }
};

const CommonForm = () => {
  const [values, setValues] = useState<CommonForm>({
    name: "Romã",
    breed: "Bulldog",
    gender: "Male",
    "health-problems": ["Fever", "Vomit"],
    vaccine: true,
    comments: "A good boy nonetheless",
    contact: "88772234|Home",
  });

  const schema: FormSchema = {
    id: "form-playground",
    children: [
      {
        elementType: "input",
        id: "name",
        label: "What is your pet name?",
        requiredCondition: true,
        type: "text",
      },
      {
        elementType: "input",
        id: "breed",
        label: "What's their breed?",
        options: ["Bulldog", "Doberman", "Mixed"],
        requiredCondition: true,
        type: "select",
      },
      {
        elementType: "input",
        id: "gender",
        label: "What's their gender?",
        options: ["Male", "Female"],
        requiredCondition: true,
        type: "radio",
      },
      {
        elementType: "input",
        id: "health-problems",
        label: "Have they ever had?",
        options: ["Fever", "Vomit", "Low appetite"],
        requiredCondition: true,
        type: "checkboxGroup",
      },
      {
        elementType: "input",
        id: "vaccine",
        label: "Have they ever been vaccinated?",
        requiredCondition: true,
        type: "switch",
      },
      {
        elementType: "input",
        id: "comments",
        label: "Other comments:",
        requiredCondition: true,
        type: "textarea",
      },
      {
        elementType: "input",
        id: "contact",
        label: "Contact:",
        requiredCondition: true,
        type: "phone",
      },
      {
        className: "!mt-xxlarge w-full",
        elementType: "button",
        id: "submit-button",
        label: "Save changes",
        type: "submit",
      },
    ],
    version: 0,
  };

  return (
    <div>
      <DisplayForm
        onChange={(props) => {
          console.log("onChange values", props);
        }}
        onSubmit={({ event, values }) => {
          event.preventDefault();
          setValues(values as CommonForm);

          console.log("onSubmit values", values);
        }}
        schema={schema}
        values={values}
      />
    </div>
  );
};

const RepeaterForm = () => {
  const [dataStructure, setDataStructure] = useState<RepeaterForm>({
    "test-repeater": [
      {
        "first-name": "Mateus",
        "last-name": "Pereira",
        "email-address": "mateus@ppteam.co",
        "contact-phone": "71 88776655|Work",
      },
    ],
  });

  const schema: FormSchema = {
    id: "form-playground",
    children: [
      {
        elementType: "repeater",
        id: "test-repeater",
        minRepeat: 1,
        children: [
          {
            elementType: "section",
            title: {
              label: "Emergency contact {{index}}",
              level: "h3",
            },
            children: [
              {
                elementType: "row",
                children: [
                  {
                    elementType: "input",
                    id: "first-name",
                    label: "First Name",
                    requiredCondition: true,
                    type: "text",
                  },
                  {
                    elementType: "input",
                    id: "last-name",
                    label: "Last Name",
                    requiredCondition: true,
                    type: "text",
                  },
                ],
              },
              {
                elementType: "row",
                children: [
                  {
                    elementType: "input",
                    id: "email-address",
                    label: "Email Address",
                    requiredCondition: true,
                    type: "email",
                  },
                  {
                    elementType: "input",
                    id: "contact-phone",
                    label: "Phone Number",
                    requiredCondition: true,
                    type: "phone",
                  },
                ],
              },
              {
                className: "!mt-xxlarge w-full",
                elementType: "button",
                enabledCondition: true,
                id: "submit-button",
                label: "Save changes",
                type: "submit",
              },
            ],
          },
        ],
      },
    ],
    version: 0,
  };

  return (
    <div>
      <div className="mb-xxlarge flex w-full justify-center">
        <Button onClick={seeDataStructure}>Ver Estrutura de dados</Button>
      </div>
      <DisplayForm
        onChange={(props) => {
          setDataStructure(props as RepeaterForm);
          console.log("onChange values", props);
        }}
        onSubmit={({ event, values }) => {
          event.preventDefault();

          console.log("onSubmit values", values);
        }}
        schema={schema}
        values={dataStructure as FormValues}
      />
    </div>
  );

  function seeDataStructure() {
    window.alert(JSON.stringify(dataStructure));
  }
};
