import { ASSET_IMAGES } from "~/assets";
import { AdvertisingBannerImageRight } from "~/components/AdvertisingBanners/AdvertisingBannerImageRight";
import { TextSpan, Title } from "~/components/design-system";

type AdvertisingSectionProps = {
  linkTo?: string;
};

export const AdvertisingSection = ({ linkTo }: AdvertisingSectionProps) => {
  return (
    <AdvertisingBannerImageRight
      buttonLabel="See quotes"
      cardStyleProps={{
        backgroundColor: "bg-orange-100",
        border: "border-orange-100",
      }}
      gradientColor="from-orange-100"
      gradientDirection="right"
      img={ASSET_IMAGES.insuranceImage}
      message="Find the care that's best for you and your pet and compare tailored insurance plans now."
      subMessage="Powered by PTZ Insurance Agency Ltd."
      title={
        <Title level="h2">
          Know your options when{" "}
          <TextSpan color="brand-main">protecting your pet</TextSpan>
        </Title>
      }
      to={linkTo}
    />
  );
};
