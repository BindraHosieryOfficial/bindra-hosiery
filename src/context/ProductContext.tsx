import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { products as defaultProducts } from "../data/products";
import { supabase } from "../lib/supabase";

const ProductContext = createContext<any>(null);
async function resolveImageUrl(image: string) {
  if (!image || !image.includes("/storage/v1/object/public/product-images/")) {
    return image;
  }

  const marker =
    "/storage/v1/object/public/product-images/";

  const path = image.split(marker)[1];

  if (!path) return image;

  const { data, error } = await supabase.storage
    .from("product-images")
    .download(decodeURIComponent(path));

  if (error || !data) {
    console.error("Image download failed:", error);
    return image;
  }

  return URL.createObjectURL(data);
}
function mapProduct(product: any) {
  let images: string[] = [];

  if (Array.isArray(product.images)) {
    images = product.images.filter(
      (image: any) =>
        typeof image === "string" && image.trim() !== ""
    );
  } else if (typeof product.images === "string") {
    try {
      const parsed = JSON.parse(product.images);

      if (Array.isArray(parsed)) {
        images = parsed.filter(
          (image: any) =>
            typeof image === "string" &&
            image.trim() !== ""
        );
      }
    } catch {
      if (product.images.trim() !== "") {
        images = [product.images.trim()];
      }
    }
  }

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    mrp: Number(product.mrp),
    sellingPrice: Number(product.selling_price),
    ageGroup: product.age_group || "",
    description: product.description || "",
    images,
    sizes: product.sizes || [],
    stock: Number(product.stock || 0),
    createdAt: product.created_at,
  };
}

export default function ProductProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading products:", error);
      return;
    }

   if (data && data.length > 0) {
  const mappedProducts = await Promise.all(
    data.map(async (product) => {
      const mappedProduct = mapProduct(product);

      const resolvedImages = await Promise.all(
        mappedProduct.images.map((image: string) =>
          resolveImageUrl(image)
        )
      );

      return {
        ...mappedProduct,
        images: resolvedImages,
      };
    })
  );

  setProducts(mappedProducts);
  return;
}

    // First-time setup:
    // If Supabase has no products yet,
    // upload the existing demo products.
    const demoProducts = defaultProducts.map((product: any) => ({
      name: product.name,
      brand: product.brand || "Bindra Hosiery",
      category: product.category,
      mrp: product.mrp,
      selling_price: product.sellingPrice,
      age_group: product.ageGroup || "",
      description: product.description || "",
      images: product.images || [],
      sizes: product.sizes || [],
      stock: product.stock || 0,
    }));

    const { data: insertedProducts, error: insertError } =
      await supabase
        .from("products")
        .insert(demoProducts)
        .select();

    if (insertError) {
      console.error(
        "Error creating demo products:",
        insertError
      );
      return;
    }

    setProducts(
      (insertedProducts || []).map(mapProduct)
    );
  }

  async function decreaseStock(
    productId: number,
    sizeName: string,
    quantity: number
  ) {
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
        refreshProducts: loadProducts,
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