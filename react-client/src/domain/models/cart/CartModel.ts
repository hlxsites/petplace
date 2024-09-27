export type CommonCartItem = {
  id: string;
  quantity: number;
  type: string;
};

export type CartItem = CommonCartItem & {
  acquisitionMessage?: string;
  description: string;
  name: string;
  price: number;
  purchaseLimit?: number;
  recurrence?: string;
};
