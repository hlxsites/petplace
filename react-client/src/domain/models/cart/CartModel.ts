export type CommonCartItem = {
  autoRenew?: boolean;
  id: string;
  quantity: number;
  price: string;
  title: string;
  type: string;
};

export type CartItem = CommonCartItem & {
  description?: string;
  isAdditionalService?: boolean;
  isService?: boolean;
  purchaseLimit?: number;
  recurrence?: string;
};

export type QueryCartItem = Pick<
  CommonCartItem,
  "autoRenew" | "id" | "quantity"
> & {
  petId: string;
};
