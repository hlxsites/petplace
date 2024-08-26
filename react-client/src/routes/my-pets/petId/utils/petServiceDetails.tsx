import { LinkButton, Text, TextSpan } from "~/components/design-system";
import { PetServiceAdditionalInfo } from "~/components/Pet/PetServiceAdditionalInfo";
import { PetServiceDetailsCardProps } from "~/components/Pet/PetServiceDetailsCard";

export type PetWatchServiceProps = PetServiceDetailsCardProps & {
  id?: string;
  title: string;
  subtitle?: string;
};

export const PET_WATCH_SERVICES_DETAILS: PetWatchServiceProps[] = [
  {
    contact: "1-866-597-2424",
    description:
      "Quickly report a lost or found pet through our customer portal or speak with our Customer Service Representatives. We will do everythign we can to help get  your pet home safely.",
    id: "lost-pet-support",
    primaryAction: { label: "Report this pet as lost" },
    secondaryActions: [
      { icon: "copyRegular", label: "Copy number" },
      { icon: "forwardedCall", label: "Call" },
    ],
    subtitle: "Find your pet 24/7",
    title: "MyPetHealth Portal",
  },
  {
    contact: "1-866-597-2424",
    description:
      "Our Lot Pet Recovery Specialists are dedicated to helping reunite lost pets with their owners 24/7/365 and can be reached at",
    id: "recovery-specialists",
    primaryAction: { label: "Report this pet as lost" },
    secondaryActions: [
      { icon: "copyRegular", label: "Copy number" },
      { icon: "forwardedCall", label: "Call" },
    ],
    title: "Lost Pet Recovery Specialists",
  },
  {
    id: "direct-connect",
    description:
      "Our Lost Pet Recovery Specialists will connect with your pet's finder and arrange a quick and safe reunion.",
    title: "DirectConnect",
  },
  {
    id: "rover-discount",
    description: (
      <Text>
        Need to step away? Find the perfect pet sitter. Use promo code provided
        via email to redeem your gift card before it expires
        <TextSpan fontWeight="semibold">X days after purchase.</TextSpan>
      </Text>
    ),
    primaryAction: {
      label: "Go to Rover Website",
    },
    title: "$30 Rover Discount",
  },
  {
    description:
      "Buy your pet something special! Find your coupon in your email. Redeemable for any in-store purchase when you sign up as a Pals Reward member.",
    id: "petco-coupon",
    primaryAction: {
      label: "Go to Petco Website",
    },
    title: "$25 Petco Coupon",
  },
  {
    additionalInfo: (
      <PetServiceAdditionalInfo
        info={
          <>
            <Text size="14">
              Please fill out the form below and email to:
              <TextSpan fontWeight="semibold">
                24PetMedAlert@24petwatch.com.
              </TextSpan>
            </Text>
            <Text size="14">
              Note: this form requires Adobe Reader,
              <LinkButton to={""} className="m-0 inline">
                <TextSpan fontWeight="bold" size="14">
                  click here
                </TextSpan>
              </LinkButton>{" "}
              to download.
            </Text>
          </>
        }
      />
    ),
    description:
      "This protects your pet by relaying your pet’s critical medical and behavioral information to veterinary care personnel, animal shelters or animal rescue organizations if your pet is lost.",
    id: "24-pet-med-alert",
    primaryAction: {
      label: "Download form",
    },
    secondaryActions: [{ label: "Copy email", icon: "copyRegular" }],
    title: "24PetMedAlert",
  },
  {
    additionalInfo: (
      <PetServiceAdditionalInfo
        info="Our friends at whiskerDocs will be sending you a welcome email with
          your account information. Make sure it’s not in your junk mail folder."
      />
    ),
    description:
      "Can’t decide whether or not to bring your pet the vet? Veterinary experts available 24/7 through phone, email or live chat, provided by whiskerDocs.",
    id: "vet-helpline",
    title: "24/7 Vet Helpline",
  },
  {
    additionalInfo: (
      <PetServiceAdditionalInfo info="Look out for your welcome email from Petcademy." />
    ),
    description:
      "Get 12-month unlimited access to Petcademy’s online platform, which offers customized training plans, training videos, unlimited messaging with trainers and access to all their online communities.",
    id: "customized-pet-training",
    title: "Customized Pet Training",
  },
  {
    additionalInfo: (
      <PetServiceAdditionalInfo info="Check your mailbox in approximately 4-6 weeks." />
    ),
    description:
      "Because your pet is unique! Your customized ID tag with your pet’s name and unique microchip number, as well as the 24Petwatch Lost Pet Recovery Service toll-free number is in the mail.",
    id: "lifetime-warranty-iD-tag",
    title: "Lifetime Warranty ID Tag",
  },
];
