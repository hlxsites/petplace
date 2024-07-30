import { Conditional, Text } from "~/components/design-system";

export const ConditionalPlayground = () => {
  return (
    <>
      <Conditional when={true}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </Conditional>
      <br />
      <Conditional whenTruthy={true}>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book.
      </Conditional>
      <br />
      <Conditional whenTruthy={false}>
        <Text fontFamily="roboto">
          Finibus Bonorum et Malorum" by Cicero are also reproduced in their
          exact original form, accompanied by English versions from the 1914
          translation by H. Rackham.
        </Text>
      </Conditional>
    </>
  );
};
