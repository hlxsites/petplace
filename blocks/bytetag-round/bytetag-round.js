export default async function decorate(block) {
  var scriptURL =
    "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    console.log("loadscript");
    var script = document.createElement("script");
    script.async = true;
    script.src = scriptURL;
    (
      document.getElementsByTagName("head")[0] ||
      document.getElementsByTagName("body")[0]
    ).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function ShopifyBuyInit() {
    console.log("shopifyBuyInit()");
    var client = ShopifyBuy.buildClient({
      domain: "bytetag.myshopify.com",
      storefrontAccessToken: "abc347e34c78c1cd83d5a8b686963f35",
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent("product", {
        id: "8339583860982",
        node: document.querySelector(".product-component-1706803973565"),
        moneyFormat: "%24%7B%7Bamount%7D%7D",
        options: {
          product: {
            styles: {
              product: {
                "@media (min-width: 601px)": {
                  "max-width": "calc(25% - 20px)",
                  "margin-left": "20px",
                  "margin-bottom": "50px",
                },
                "carousel-button": {
                  display: "none",
                },
              },
              title: {
                "font-family": "Source Sans Pro, sans-serif",
                color: "#323f48",
              },
              button: {
                ":hover": {
                  "background-color": "#ac0b38",
                },
                "background-color": "#bf0c3e",
                ":focus": {
                  "background-color": "#ac0b38",
                },
                "border-radius": "10px",
              },
              price: {
                "font-family": "Source Sans Pro, sans-serif",
                "font-weight": "bold",
                color: "#323f48",
              },
              compareAt: {
                "font-family": "Source Sans Pro, sans-serif",
                "font-weight": "bold",
                color: "#323f48",
              },
              unitPrice: {
                "font-family": "Source Sans Pro, sans-serif",
                "font-weight": "bold",
                color: "#323f48",
              },
            },
            contents: {
              img: false,
              imgWithCarousel: true,
              button: false,
              buttonWithQuantity: true,
            },
            text: {
              button: "Add to cart",
            },
            googleFonts: ["Source Sans Pro"],
          },
          productSet: {
            styles: {
              products: {
                "@media (min-width: 601px)": {
                  "margin-left": "-20px",
                },
              },
            },
          },
          modalProduct: {
            contents: {
              img: false,
              imgWithCarousel: true,
              button: false,
              buttonWithQuantity: true,
            },
            styles: {
              product: {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0px",
                  "margin-bottom": "0px",
                },
              },
              button: {
                ":hover": {
                  "background-color": "#ac0b38",
                },
                "background-color": "#bf0c3e",
                ":focus": {
                  "background-color": "#ac0b38",
                },
                "border-radius": "10px",
              },
              title: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "bold",
                "font-size": "26px",
                color: "#4c4c4c",
              },
              price: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "18px",
                color: "#4c4c4c",
              },
              compareAt: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "15.299999999999999px",
                color: "#4c4c4c",
              },
              unitPrice: {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "15.299999999999999px",
                color: "#4c4c4c",
              },
            },
            text: {
              button: "Add to cart",
            },
          },
          option: {
            styles: {
              label: {
                "font-family": "Source Sans Pro, sans-serif",
                color: "#323f48",
              },
              select: {
                "font-family": "Source Sans Pro, sans-serif",
              },
            },
            googleFonts: ["Source Sans Pro"],
          },
          cart: {
            styles: {
              button: {
                ":hover": {
                  "background-color": "#ac0b38",
                },
                "background-color": "#bf0c3e",
                ":focus": {
                  "background-color": "#ac0b38",
                },
                "border-radius": "10px",
              },
              title: {
                color: "#323f48",
              },
              header: {
                color: "#323f48",
              },
              lineItems: {
                color: "#323f48",
              },
              subtotalText: {
                color: "#323f48",
              },
              subtotal: {
                color: "#323f48",
              },
              notice: {
                color: "#323f48",
              },
              currency: {
                color: "#323f48",
              },
              close: {
                color: "#323f48",
                ":hover": {
                  color: "#323f48",
                },
              },
              empty: {
                color: "#323f48",
              },
              noteDescription: {
                color: "#323f48",
              },
              discountText: {
                color: "#323f48",
              },
              discountIcon: {
                fill: "#323f48",
              },
              discountAmount: {
                color: "#323f48",
              },
            },
            text: {
              total: "Subtotal",
              button: "Checkout",
            },
            popup: false,
          },
          toggle: {
            styles: {
              toggle: {
                "background-color": "#bf0c3e",
                ":hover": {
                  "background-color": "#ac0b38",
                },
                ":focus": {
                  "background-color": "#ac0b38",
                },
              },
            },
          },
          lineItem: {
            styles: {
              variantTitle: {
                color: "#323f48",
              },
              title: {
                color: "#323f48",
              },
              price: {
                color: "#323f48",
              },
              fullPrice: {
                color: "#323f48",
              },
              discount: {
                color: "#323f48",
              },
              discountIcon: {
                fill: "#323f48",
              },
              quantity: {
                color: "#323f48",
              },
              quantityIncrement: {
                color: "#323f48",
                "border-color": "#323f48",
              },
              quantityDecrement: {
                color: "#323f48",
                "border-color": "#323f48",
              },
              quantityInput: {
                color: "#323f48",
                "border-color": "#323f48",
              },
            },
          },
        },
      });
    });
  }
}
