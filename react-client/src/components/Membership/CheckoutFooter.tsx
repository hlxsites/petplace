import { ASSET_IMAGES } from "~/assets";
import { LinkButton, Text } from "../design-system";

export const CheckoutFooter = () => {
  const footerLinks = [
    {
      label: "Privacy Policy",
      path: "https://www.petplace.com/privacy-policy",
    },
    {
      label: "Terms of Use",
      path: "https://www.petplace.com/terms-of-use",
    },
  ];

  return (
    <footer className="bg-background-dark h-[261px] w-full lg:h-[224px]">
      <div className="flex h-[138px] w-full items-center bg-white px-base lg:h-[159px] lg:px-xxlarge">
        <img
          className="max-h-[31px] max-w-[375px] lg:max-h-[56px] lg:max-w-[207px]"
          alt="PetPlace logo"
          src={ASSET_IMAGES.petPlaceLogo}
        />
      </div>
      <div className="flex flex-col items-center justify-between gap-large px-base pt-base text-center md:flex-row lg:px-xxlarge">
        <div className="flex gap-xxlarge">
          {footerLinks.map(({ label, path }) => (
            <LinkButton
              className="text-sm font-normal text-neutral-white"
              key={label}
              to={path}
            >
              {label}
            </LinkButton>
          ))}
        </div>
        <Text color="neutral-white" size="14">
          ©Copyright 1999 - 2023. Independence American Holdings Corp. All
          Rights Reserved
        </Text>
      </div>
    </footer>
  );
};
