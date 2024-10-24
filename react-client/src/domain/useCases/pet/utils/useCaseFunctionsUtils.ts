type Products = {
  Id: string;
  IsExpired: boolean;
  Name: string;
};

export function getPetProducts(products: Products[]) {
  return products.map(({ Id: id, IsExpired: isExpired, Name: name }) => ({
    id,
    isExpired,
    name,
  }));
}
