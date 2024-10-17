import { Button, Text, TextSpan } from "~/components/design-system";
import { PetServiceAdditionalInfo } from "~/components/Pet/PetServiceAdditionalInfo";
import { PetServiceDetailsCardProps } from "~/components/Pet/PetServiceDetailsCard";
import { copyTextToClipboard } from "~/routes/my-pets/petId/utils/servicesUtils";
import { downloadFile } from "~/util/downloadFunctions";
import { dialPhoneNumber } from "~/util/phoneUtils";

export type PetWatchServiceProps = Omit<
  PetServiceDetailsCardProps,
  "isModalOpen" | "onCloseModal" | "onConfirmModal"
> & {
  id?: string;
  title: string;
  subtitle?: string;
};

export const PET_WATCH_SERVICES_DETAILS: PetWatchServiceProps[] = [
  {
    contact: "1-866-597-2424",
    description:
      "Quickly report a lost or found pet through our customer portal or speak with our Customer Service Representatives. We will do everything we can to help get  your pet home safely.",
    id: "lost-pet-support",
    primaryAction: { buttonLabel: "Report this pet as lost" },
    secondaryActions: [
      {
        icon: "copyRegular",
        buttonLabel: "Copy number",
        onClick: () => copyTextToClipboard("1-866-597-2424"),
      },
      { icon: "forwardedCall", buttonLabel: "Call", href: "tel:+18665972424" },
    ],
    subtitle: "Find your pet 24/7",
    title: "MyPetHealth Portal",
  },
  {
    contact: "1-866-597-2424",
    description:
      "Our Lost Pet Recovery Specialists are dedicated to helping reunite lost pets with their owners and can be reached at:",
    id: "recovery-specialists",
    primaryAction: { buttonLabel: "Report this pet as lost" },
    secondaryActions: [
      {
        icon: "copyRegular",
        buttonLabel: "Copy number",
        onClick: () => copyTextToClipboard("1-866-597-2424"),
      },
      {
        icon: "forwardedCall",
        buttonLabel: "Call",
        onClick: () => dialPhoneNumber({ href: "tel:+18665972424" }),
      },
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
      <Text size="14">
        Need to step away? Find the perfect pet sitter. Use promo code provided
        in your email to redeem your gift card before it expires
        <TextSpan fontWeight="semibold" inherit>
          1 year after purchase.
        </TextSpan>{" "}
        One time use.
      </Text>
    ),
    primaryAction: {
      buttonLabel: "Go to Rover Website",
    },
    title: "$30 Rover Discount",
  },
  {
    description:
      "Buy your pet something special! Find your coupon in your email. Redeemable for any in-store purchase when you sign up as a Pals Reward member.",
    id: "petco-coupon",
    primaryAction: {
      buttonLabel: "Go to Petco Website",
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
              <Button
                className="inline font-bold"
                onClick={() =>
                  downloadFile({
                    url: "https://drive.google.com/uc?export=download&id=164zo5X6eA3vDCSZw87BifbGvmaLNRi4p",
                    fileName: "form.pdf",
                  })
                }
                variant="link"
                style={{ fontSize: 14 }}
              >
                click here
              </Button>
              to download.
            </Text>
          </>
        }
      />
    ),
    description: (
      <Text size="14">
        This protects your pet by relaying your pet’s critical medical and
        behavioral information to veterinary care personnel, animal shelters or
        animal rescue organizations if your pet is lost.{" "}
        <TextSpan fontWeight="bold" inherit>
          Expires 1 year after purchase.
        </TextSpan>{" "}
        Available for renewal on an annual basis.
      </Text>
    ),
    id: "PetMedInfo Fees",
    primaryAction: {
      buttonLabel: "Download form",
    },
    secondaryActions: [
      {
        buttonLabel: "Copy email",
        icon: "copyRegular",
        onClick: () => copyTextToClipboard("24PetMedAlert@24petwatch.com"),
      },
    ],
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
    id: "WD Annual Membership",
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
