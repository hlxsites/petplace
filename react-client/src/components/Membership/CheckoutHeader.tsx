import { ASSET_IMAGES } from "~/assets";

export const CheckoutHeader = () => {
  return (
    <header className="m-0 h-[106px] w-full bg-white px-base pt-[59px] lg:h-[88px] lg:px-xxlarge lg:py-base">
      <img
        className="max-h-[31px] max-w-[375px] lg:max-h-[56px] lg:max-w-[207px]"
        alt="PetPlace logo"
        src={ASSET_IMAGES.petPlaceLogo}
      />
    </header>
  );
};
