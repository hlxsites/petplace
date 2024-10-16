import { useCallback, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { defer, LoaderFunction, useLoaderData } from "react-router-typesafe";
import { CartItem } from "~/domain/models/cart/CartModel";
import getCartCheckoutFactory from "~/domain/useCases/cart/getCartCheckoutFactory";
import getCheckoutFactory from "~/domain/useCases/checkout/getCheckoutFactory";
import getProductsFactory from "~/domain/useCases/products/getProductsFactory";
import { useDeepCompareEffect } from "~/hooks/useDeepCompareEffect";

import { MembershipPlanId } from "~/domain/checkout/CheckoutModels";
import { DetailedCartItem } from "~/domain/models/products/ProductModel";
import { PRODUCT_DETAILS } from "~/domain/useCases/products/utils/productsHardCodedData";
import {
  convertProductToCartItem,
  findProductBasedOnOptionId,
  getProductColorSizeBasedOnCartId,
} from "~/domain/util/checkoutProductUtil";
import { logAnalyticsEvent } from "~/infrastructure/telemetry/logEvent";
import { PET_ID_ROUTE_PARAM } from "~/routes/AppRoutePaths";
import { requireAuthToken } from "~/util/authUtil";
import { forceRedirect } from "~/util/forceRedirectUtil";
import { invariantResponse } from "~/util/invariant";
import { redirectToMph } from "~/util/mphRedirectUtil";
import {
  ANIMAL_PLAN_PARAM,
  CART_CONTENT_KEY,
  CONTENT_PARAM_KEY,
} from "~/util/searchParamsKeys";
import { formatPrice, getValueFromPrice } from "~/util/stringUtil";
import { OPT_IN_LABEL } from "./utils/hardCodedRenewPlan";

export const loader = (async ({ request }) => {
  const url = new URL(request.url);
  const petId = url.searchParams.get(PET_ID_ROUTE_PARAM);
  invariantResponse(petId, "petId param is required");

  const plan = url.searchParams.get("plan");
  invariantResponse(plan, "plan param is required");

  const authToken = requireAuthToken();

  const useCase = getCheckoutFactory(authToken);
  const checkoutData = await useCase.query(petId);

  const plans = checkoutData?.plans || [];
  const selectedPlanItem = plans.find((item) => item.id === plan);
  invariantResponse(selectedPlanItem, "plan is required");

  const isService = (id: MembershipPlanId): boolean => {
    return (
      id === "AnnualMembership" ||
      id === "LPMPlusMembership" ||
      id === "LPMMembership"
    );
  };

  const selectedPlan = {
    ...selectedPlanItem,
    autoRenew: false,
    petId,
    quantity: 1,
    isService: isService(selectedPlanItem.hardCodedPlanId),
  };

  const productsUseCase = getProductsFactory(authToken);
  const productsData = (await productsUseCase.query(petId, plan)) || [];

  const cartCheckoutUseCase = getCartCheckoutFactory(authToken);
  const postCart = cartCheckoutUseCase.post;
  const getCart = cartCheckoutUseCase.query;

  const savedCart = await getCart();

  return defer({
    savedCart,
    petId,
    postCart,
    products: productsData,
    selectedPlan,
  });
}) satisfies LoaderFunction;

export const useCheckoutProductsViewModel = () => {
  const { savedCart, petId, postCart, products, selectedPlan } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmittingCart, setIsSubmittingCart] = useState(false);

  const animalPlanParam = searchParams.get(ANIMAL_PLAN_PARAM);
  const contentParam = searchParams.get(CONTENT_PARAM_KEY);
  const isOpenCart = contentParam === CART_CONTENT_KEY;

  const autoRenew = !!cartItems.find((item) => item.id === selectedPlan.id)
    ?.autoRenew;

  const getProductType = useCallback(
    (id: string): string | undefined => {
      const product = products.find((p) => p.id === id);
      return product?.type;
    },
    [products]
  );

  const getProductPurchaseLimit = useCallback(
    (productType?: string, purchaseLimit?: number) => {
      const isAnnualProduct = productType
        ?.toLocaleLowerCase()
        .includes("annual");
      return isAnnualProduct ? 1 : purchaseLimit;
    },
    []
  );

  const updateCartItemsState = useCallback(
    (callback: ((prevState: CartItem[]) => CartItem[]) | CartItem[]) => {
      setCartItems((prevState) => {
        const updatedState = Array.isArray(callback)
          ? callback
          : callback(prevState);

        const updatedStateWithAdditionalService = updatedState.map((item) => ({
          ...item,
          isAdditionalService:
            getProductPurchaseLimit(getProductType(item.id)) === 1,
        }));

        updatedStateWithAdditionalService.sort((a, b) =>
          a.isService && !b.isService ? -1 : 1
        );

        return updatedStateWithAdditionalService;
      });
    },
    [getProductType, getProductPurchaseLimit]
  );

  useDeepCompareEffect(() => {
    const manageInitialCartItems = () => {
      let didAddMembership = false;
      const initialCartItems: CartItem[] = [];

      savedCart.forEach((savedProduct) => {
        if (savedProduct.petId !== petId) return;

        // Handle membership plan
        if (selectedPlan.id === savedProduct.id && !didAddMembership) {
          didAddMembership = true;
          initialCartItems.push({
            ...selectedPlan,
            autoRenew: savedProduct.autoRenew,
          });
          return;
        }

        // Handle products
        const product = findProductBasedOnOptionId(savedProduct.id, products);
        if (!product) return;

        const selectedColorSize = getProductColorSizeBasedOnCartId(
          savedProduct.id,
          product
        );
        if (!selectedColorSize) return;

        const item = convertProductToCartItem(product, selectedColorSize);
        if (item)
          initialCartItems.push({ ...item, quantity: savedProduct.quantity });
      });

      if (!didAddMembership) {
        // We want to add the membership plan to the cart if it's not there yet
        initialCartItems.push(selectedPlan);
      }
      updateCartItemsState(initialCartItems);
    };

    if (!cartItems.length && savedCart && products.length && selectedPlan) {
      manageInitialCartItems();
    }
  }, [cartItems.length, products, savedCart, selectedPlan]);

  const onUpdateOptIn = () => {
    const newAutoRenew = !autoRenew;

    updateCartItemsState((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((item) =>
        item.id === selectedPlan.id
          ? { ...item, autoRenew: newAutoRenew }
          : item
      );

      return updatedCartItems;
    });
  };

  const onUpdateQuantity = (id: string, newQuantity: number) => {
    updateCartItemsState((prevItems) => {
      const productType = getProductType(id);
      // The purchase limit is set to 1 in accordance with what was defined on the task 84348
      const purchaseLimit = getProductPurchaseLimit(productType, 1);

      const adjustedQuantity = purchaseLimit
        ? Math.min(newQuantity, purchaseLimit)
        : newQuantity;

      if (adjustedQuantity === 0) {
        return prevItems.filter((item) => item.id !== id);
      }

      return prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: adjustedQuantity };
        }
        return item;
      });
    });
  };

  const onUpdateCartProduct = (product: CartItem) => {
    logAnalyticsEvent({
      category: "checkout",
      action: "update_cart",
      label: product.title,
      value: Number(product.price),
      nonInteraction: false,
    });

    updateCartItemsState((prevState) => {
      let updatedState: CartItem[] = [];
      // The product already exists in the cart
      const exist = prevState.find((item) => item.id === product.id);
      if (exist) {
        updatedState = prevState.map((item) => {
          if (item.id === product.id) return product;

          return item;
        });
      } else {
        updatedState = [...prevState, product];
      }
      return updatedState;
    });
  };

  function getOptInLabel() {
    const planType = selectedPlan.type.toLowerCase();
    if (planType.includes("annual")) return OPT_IN_LABEL["AnnualProduct"];
    return OPT_IN_LABEL["default"];
  }

  function onCloseCart() {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.delete(CONTENT_PARAM_KEY);
      return nextSearchParams;
    });
  }

  function onOpenCart() {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set(CONTENT_PARAM_KEY, CART_CONTENT_KEY);
      return nextSearchParams;
    });
  }

  function onOpenMoreInfo(itemId: string) {
    setSearchParams((nextSearchParams) => {
      nextSearchParams.set(CONTENT_PARAM_KEY, itemId);
      return nextSearchParams;
    });
  }

  function onCloseMoreInfo() {
    setSearchParams((searchParams) => {
      searchParams.delete(CONTENT_PARAM_KEY);
      return searchParams;
    });
  }

  const onContinueToCheckoutPayment = () => {
    setIsSubmittingCart(true);
    void (async () => {
      await postCart(cartItems, petId);

      logAnalyticsEvent({
        category: "checkout",
        action: "proceed_to_payment",
        nonInteraction: false,
      });

      const uri = redirectToMph(
        `petplace/cart?animalID=${petId}&planID=${animalPlanParam}`
      );
      forceRedirect(uri);
    })();
  };

  const selectedProduct: DetailedCartItem | null = (() => {
    // If the cart is open, we don't want to show the detailed product view
    if (isOpenCart) return null;

    const product = products.find(({ id }) => id === contentParam);
    if (!product) return null;

    // Get additional hard-coded info, privacy features, and tag features
    const productDetails = PRODUCT_DETAILS[product.id];
    if (!productDetails) return null;

    const {
      additionalInfo,
      detailedDescription,
      privacyFeatures,
      tagFeatures,
    } = productDetails;
    return {
      ...product,
      additionalInfo,
      detailedDescription,
      privacyFeatures,
      tagFeatures,
    };
  })();

  const subtotal = (() => {
    const sum = cartItems.reduce((total, item) => {
      if (!item.price) return 0;

      const itemPrice = getValueFromPrice(item.price.toString());
      const itemQuantity = item.quantity ?? 1;
      return total + itemPrice * itemQuantity;
    }, 0);

    return formatPrice(sum);
  })();

  return {
    autoRenew,
    cartItems,
    isOpenCart,
    isSubmittingCart,
    optInLabel: getOptInLabel(),
    onContinueToCheckoutPayment,
    onCloseCart,
    onCloseMoreInfo,
    onOpenCart,
    onOpenMoreInfo,
    onUpdateCartProduct,
    onUpdateQuantity,
    onUpdateOptIn,
    products,
    selectedProduct,
    subtotal,
  };
};

export const useCheckoutProductsViewModelContext = () =>
  useOutletContext<ReturnType<typeof useCheckoutProductsViewModel>>();
