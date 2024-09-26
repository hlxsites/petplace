import { PetCommon } from "../pet/PetModel";

export type AnimalInfo = Pick<PetCommon, "id">;

export type CartItem = {
  acquisitionMessage?: string;
  description: string;
  id: string;
  name: string;
  price: string;
  purchaseLimit?: number;
  quantity: number;
  recurrence?: string;
  type: string;
};
