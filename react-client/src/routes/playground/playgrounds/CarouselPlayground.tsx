import {
  Card,
  Carousel,
  ImageCarousel,
  Text,
  Title,
} from "~/components/design-system";

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

  const images = [
    {
      src: "https://cdn.shopify.com/s/files/1/0593/0349/3809/files/slide-preview_6a283b9a-156b-4c82-9d69-4e5f0b87cc66_280x420.jpg?v=1709746081",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0593/0349/3809/files/Black_24Pet_2048x_74bc36de-8ae5-420d-a406-cabc954b356e_280x420.jpg?v=1723143592",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0593/0349/3809/files/slide-preview_6a283b9a-156b-4c82-9d69-4e5f0b87cc66_280x420.jpg?v=1709746081",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0593/0349/3809/files/Black_24Pet_2048x_74bc36de-8ae5-420d-a406-cabc954b356e_280x420.jpg?v=1723143592",
    },
  ];

  return (
    <>
      <div className="max-w-[300px] bg-orange-100">
        <Carousel ariaLabel="A carousel example" items={items} />
      </div>
      <div className="max-w-[311px] bg-orange-100">
        <ImageCarousel ariaLabel="A carousel of images" items={images} />
      </div>
    </>
  );
};
