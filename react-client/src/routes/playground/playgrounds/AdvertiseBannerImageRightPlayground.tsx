import { AdvertisingBannerImageRight } from "~/components/AdvertisingBanners/AdvertisingBannerImageRight";
import { TextSpan, Title } from "~/components/design-system";

export const AdvertisingBannerImageRightPlayground = () => {
  return (
    <div className="grid gap-xxxxxlarge">
      <div className="grid gap-xlarge">
        <Title>With small image</Title>
        <AdvertisingBannerImageRight
          buttonLabel="Discover my Options"
          cardStyleProps={{
            backgroundColor: "bg-orange-100",
            border: "border-orange-100",
          }}
          img="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg"
          message="It is stressful when a furry family member is lost. Protect and care for your pet with 24Petwatch enhanced Lost Pet Protection."
          title={
            <Title level="h2">
              Know your options when{" "}
              <TextSpan color="brand-main">protecting your pet</TextSpan>
            </Title>
          }
          gradientColor="from-orange-100"
          gradientDirection="right"
        />
      </div>

      <div className="grid gap-xlarge">
        <Title>With big image</Title>
        <AdvertisingBannerImageRight
          buttonLabel="Discover my Options"
          cardStyleProps={{
            backgroundColor: "bg-orange-100",
            border: "border-orange-100",
          }}
          img="https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg"
          message="It is stressful when a furry family member is lost. Protect and care for your pet with 24Petwatch enhanced Lost Pet Protection."
          title={
            <Title level="h2">
              Know your options when{" "}
              <TextSpan color="brand-main">protecting your pet</TextSpan>
            </Title>
          }
          gradientColor="from-orange-100"
          gradientDirection="right"
        />
      </div>
    </div>
  );
};
