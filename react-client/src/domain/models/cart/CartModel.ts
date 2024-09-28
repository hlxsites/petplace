export type CommonCartItem = {
  petId?: string;
  id: string;
  quantity: number;
  type: string;
  name: string;
  price?: number | string;
};

export type CartItem = CommonCartItem & {
  description?: string;
  isService?: boolean;
  purchaseLimit?: number;
  recurrence?: string;
};
