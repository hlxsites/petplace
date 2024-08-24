import { CartItem } from "~/components/Membership/utils/cartTypes";

export const mockCartItems: CartItem[] = [
  {
    id: "pet-plan",
    name: "Lifetime",
    type: "service",
    description: "24/7 Vet Help & Lost Pet Protection and more...",
    recurrence: "One-time fee",
    acquisitionMessage: "Change membership plan",
    price: "$99.95",
    quantity: 1,
  },
  {
    id: "byte-tag",
    name: "ByteTag",
    type: "product",
    description: "Slide - Medium",
    purchaseLimit: 5,
    price: "$19.95",
    quantity: 2,
  },
];
