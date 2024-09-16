import { Card, Carousel, Text, Title } from "~/components/design-system";

const SAMPLE_FOR_CARD = [
  {
    bgColor: "bg-blue-100",
    description: "Description of Slide 1",
    title: "Slide 1",
  },
  {
    bgColor: "bg-green-100",
    description: "Description of Slide 2",
    title: "Slide 2",
  },
  {
    bgColor: "bg-red-100",
    description: "Description of Slide 3",
    title: "Slide 3",
  },
];

export const CarouselPlayground = () => {
  const items = SAMPLE_FOR_CARD.map(({ bgColor, description, title }) => (
    // @ts-expect-error - ignoring for test purposes only
    <Card backgroundColor={bgColor} key={`card-${title}`}>
      <div className="grid gap-small p-base">
        <Title level="h3">{title}</Title>
        <Text>{description}</Text>
      </div>
    </Card>
  ));

  return (
    <div className="max-w-[300px] bg-orange-100">
      <Carousel ariaLabel="A carousel example" items={items} />
    </div>
  );
};
