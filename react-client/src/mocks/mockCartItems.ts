import { CartItem } from "~/domain/models/cart/CartModel";

export const mockCartItems: CartItem[] = [
  {
    autoRenew: false,
    id: "pet-plan",
    title: "Lifetime",
    type: "service",
    description: "24/7 Vet Help & Lost Pet Protection and more...",
    recurrence: "One-time fee",
    price: "$99.95",
    quantity: 1,
  },
  {
    autoRenew: false,
    id: "byte-tag",
    title: "ByteTag",
    type: "product",
    description: "Slide - Medium",
    purchaseLimit: 5,
    price: "$19.95",
    quantity: 2,
  },
];
