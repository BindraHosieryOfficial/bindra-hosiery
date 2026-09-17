import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { products as defaultProducts } from "../data/products";

const ProductContext = createContext<any>(null);

export default function ProductProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<any[]>(() => {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      return JSON.parse(savedProducts);
    }

    return defaultProducts;
  });

  useEffect(() => {
    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );
  }, [products]);

  function decreaseStock(
  productId: number,
  sizeName: string,
  quantity: number
) {
  console.log("DECREASE STOCK CALLED:", {
  productId,
  sizeName,
  quantity,
});
  setProducts((currentProducts) =>
    currentProducts.map((product) => {
      if (Number(product.id) !== Number(productId)) {
        return product;
      }

      return {
        ...product,

        sizes: (product.sizes || []).map((size: any) => {
          if (
            String(size.name).trim() !==
            String(sizeName).trim()
          ) {
            return size;
          }

          return {
            ...size,
            stock: Math.max(
              0,
              Number(size.stock || 0) -
                Number(quantity || 0)
            ),
          };
        }),
      };
    })
  );
}
  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        decreaseStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProduct must be used inside ProductProvider"
    );
  }

  return context;
}