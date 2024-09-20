import { ComponentProps } from "react";
import {
  Text as DefaultTextComponent,
  TextSpan,
  Title,
} from "~/components/design-system";

const Text = (props: ComponentProps<typeof DefaultTextComponent>) => (
  <DefaultTextComponent size="16" {...props} />
);

const BoldText = (props: ComponentProps<typeof DefaultTextComponent>) => (
  <Text fontWeight="bold" {...props} />
);

export const TextPlayground = () => {
  const renderTitle = (title: string) => <Title level="h3">{title}</Title>;

  const titleWithSeparator = (title: string) => (
    <>
      <hr className="my-medium" />
      {renderTitle(title)}
    </>
  );

  return (
    <>
      {renderTitle("Font size")}
      <Text size="12">Font size: 12</Text>
      <Text size="14">Font size: 14</Text>
      <Text size="16">Font size: 16</Text>
      <Text size="18">Font size: 18</Text>
      <Text size="20">Font size: 20</Text>
      <Text size="24">Font size: 24</Text>
      <Text size="32">Font size: 32</Text>
      <Text size="40">Font size: 40</Text>
      {titleWithSeparator("Font family")}
      <Text fontFamily="franklin">
        Franklin text with{" "}
        <TextSpan fontWeight="medium">medium weight</TextSpan> and{" "}
        <TextSpan fontWeight="bold">bold weight</TextSpan>
      </Text>
      <Text fontFamily="raleway">
        Raleway text with <TextSpan fontWeight="medium">medium weight</TextSpan>{" "}
        and <TextSpan fontWeight="bold">bold weight</TextSpan>
      </Text>
      <Text fontFamily="roboto">
        Roboto text with <TextSpan fontWeight="medium">medium weight</TextSpan>{" "}
        and <TextSpan fontWeight="bold">bold weight</TextSpan>
      </Text>
      {titleWithSeparator("Font weight")}
      <Text fontWeight="normal">Text with normal weight</Text>
      <Text fontWeight="medium">Text with medium weight</Text>
      <Text fontWeight="bold">Text with bold weight</Text>

      {titleWithSeparator("Text color")}
      <BoldText color="main">main text</BoldText>
      <BoldText color="brand-blue">brand-blue text</BoldText>
      <BoldText color="brand-main">brand-main text</BoldText>
      <BoldText color="brand-secondary">brand-secondary text</BoldText>
      <BoldText color="blue-300">blue-300 text</BoldText>
      <BoldText color="blue-500">blue-500 text</BoldText>
      <BoldText color="red-300">red-300 text</BoldText>
      <BoldText color="red-500">red-500 text</BoldText>
      <BoldText color="green-100">green-100 text</BoldText>
      <BoldText color="green-300">green-300 text</BoldText>
      <BoldText color="green-500">green-500 text</BoldText>
      <BoldText color="maroon-100">maroon-100 text</BoldText>
      <BoldText color="maroon-300">maroon-300 text</BoldText>
      <BoldText color="maroon-500">maroon-500 text</BoldText>
      <BoldText color="purple-100">purple-100 text</BoldText>
      <BoldText color="purple-300">purple-300 text</BoldText>
      <BoldText color="purple-500">purple-500 text</BoldText>
      <BoldText color="yellow-100">yellow-100 text</BoldText>
      <BoldText color="yellow-300">yellow-300 text</BoldText>
      <BoldText color="yellow-500">yellow-500 text</BoldText>
    </>
  );
};
