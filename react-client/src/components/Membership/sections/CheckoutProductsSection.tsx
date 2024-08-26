import { CheckoutProduct, Colors, Sizes } from "~/mocks/MockRestApiServer";
import { CheckoutProductCard } from "../CheckoutProductCard";
import { CheckoutProductColorSize } from "../CheckoutProductColorSize";
import { Text } from "~/components/design-system";
import { classNames } from "~/util/styleUtil";

type CheckoutProductsSectionProps = {
  products: CheckoutProduct[];
};

export const CheckoutProductsSection = ({
  products,
}: CheckoutProductsSectionProps) => {
  const productsLength = products.length;

  return (
    <div
      className={classNames("grid grid-cols-1 gap-large", {
        "lg:grid-cols-3": productsLength > 2,
        "lg:grid-cols-2": productsLength >= 1 && productsLength <= 2,
      })}
    >
      {products.map(
        ({
          availableColors,
          availableSizes,
          description,
          img,
          title,
          ...rest
        }) => (
          <CheckoutProductCard
            {...rest}
            product={renderProduct(img, title)}
            productSpecifications={renderProductSpecifications(
              description,
              availableColors,
              availableSizes
            )}
            title={title}
          />
        )
      )}
    </div>
  );

  function renderProduct(img: string, name: string) {
    return (
      <img
        alt={`image of product: ${name}`}
        className="h-full w-full object-contain"
        src={img}
      />
    );
  }

  function renderProductSpecifications(
    description?: string,
    availableColors?: Colors[],
    availableSizes?: Sizes[]
  ) {
    return description ? (
      <Text>{description}</Text>
    ) : (
      availableColors && availableSizes && (
        <CheckoutProductColorSize
          productColors={availableColors}
          productSizes={availableSizes}
        />
      )
    );
  }
};
