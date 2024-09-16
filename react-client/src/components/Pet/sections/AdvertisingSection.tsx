import { AdvertisingBannerImageRight } from "~/components/AdvertisingBanners/AdvertisingBannerImageRight";
import { TextSpan, Title } from "~/components/design-system";

export const AdvertisingSection = () => {
  return (
    <AdvertisingBannerImageRight
      buttonLabel="Protect my Pet"
      buttonProps={{
        fullWidth: true,
      }}
      cardStyleProps={{
        backgroundColor: "bg-purple-100",
        border: "border-purple-100",
      }}
      gradientColor="from-purple-100"
      gradientDirection="right"
      img="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg"
      message="It is stressful when a furry family member is lost. Protect and care for your pet with 24Petwatch enhanced Lost Pet Protection."
      title={
        <Title level="h2">
          Did you know that 1 in 3 pets{" "}
          <TextSpan color="orange-300-contrast">go missing?</TextSpan>
        </Title>
      }
    />
  );
};
