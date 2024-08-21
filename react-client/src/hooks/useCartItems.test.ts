import { act, renderHook } from "@testing-library/react";
import { CartItem } from "~/components/Membership/utils/cartTypes";
import { useCartItems } from "./useCartItems";

describe("useCartItems hook", () => {
  it("calculates subtotal as zero for empty items list", () => {
    const { result } = getHookRenderer([]);
    expect(result.current.subtotal).toBe("0.00");
  });

  it("calculates correct subtotal for given items", () => {
    const items = [
      { price: "$ 100", quantity: 2 },
      { price: "$ 200", quantity: 3 },
    ];
    const { result } = getHookRenderer(items);
    expect(result.current.subtotal).toBe("800.00");
  });

  it("updates subtotal when items change", () => {
    const initialItems = [{ price: "$ 100", quantity: 2 }];
    const { result, rerender } = renderHook((props) => useCartItems(props as CartItem[]), {
      initialProps: initialItems,
    });
    expect(result.current.subtotal).toBe("200.00");

    act(() => {
      rerender([{ price: "$ 100", quantity: 3 }]);
    });
    expect(result.current.subtotal).toBe("300.00");
  });

  it("assumes quantity of 1 when not provided", () => {
    const items = [{ price: "$ 150" }];
    const { result } = getHookRenderer(items);
    expect(result.current.subtotal).toBe("150.00");
  });
});

function getHookRenderer(items: Partial<CartItem>[]) {
  return renderHook(() => useCartItems(items as CartItem[]));
}
