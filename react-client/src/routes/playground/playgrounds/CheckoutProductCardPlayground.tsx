import { Text } from "~/components/design-system";
import { CheckoutProductCard } from "~/components/Membership/CheckoutProductCard";
import { CheckoutProductColorSize } from "~/components/Membership/CheckoutProductColorSize";

export const CheckoutProductCardPlayground = () => {
  return (
    <div className="grid grid-cols-3 gap-large">
      <CheckoutProductCard
        price="$24.95"
        title="24PetMedAlert"
        product={renderProduct()}
        productSpecifications={renderProductSpecifications()}
      />
      <CheckoutProductCard
        price="$24.95"
        title="24PetMedAlert"
        product={renderProduct()}
        productSpecifications={renderProductSpecifications()}
      />
      <CheckoutProductCard
        isAnnual
        price="$24.95"
        title="24PetMedAlert"
        product={renderProduct()}
        productSpecifications={
          <CheckoutProductColorSize
            productColors={["black"]}
            productSizes={["L", "S/M"]}
          />
        }
      />
    </div>
  );

  function renderProduct() {
    return (
      <img
        className="h-full w-full object-contain"
        src="https://s3-alpha-sig.figma.com/img/c719/8a55/9d54d4db8c1e404cce5823f148596ae3?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e~Gnf3K0y75CxfbL~wWj~NugWyyj0nshHZHyD-CmzpaVenkl3jthKbZCwzA73O80wKQYM-mfusjE~g4edCiJwbuHoIwIsQZlDyUg3O0NxY2XJAp25~VEmn0VikLrpB9PJvjY0txOgz4N6J2EqwbcSK2SBkXrrFoSZyS-MVWJgdVuKJTjKhEIKFcYeM37hkfagmxuDExyq-2YaFsnloM6FXigCy9zZDUDTk2O0IRTJ5e5sciQXqXWFgT~QCmmblcf9zRIfnvyiZckCAGE8XEGATqwe~dXpM-AjQfnLmB~vGuYmqztWj-qx7x5kxMU8o2sdjbQfIOXOavDlcdlk-sC4g__"
      />
    );
  }

  function renderProductSpecifications() {
    return (
      <Text>
        Reach veterinary professionals anytime by phone, email or live chat,
        provided by whiskerDocs.
      </Text>
    );
  }
};
