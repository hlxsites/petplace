export type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
};

export type CartItem = {
  id: string;
  name: string;
  price: string;
  purchaseLimit?: number;
  quantity: number;
  recurrence?: string;
  acquisitionMessage?: string;
  type: CartItemType;
  description: string;
};

type CartItemType = "product" | "service";
