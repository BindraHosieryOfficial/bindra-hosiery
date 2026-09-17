import ProductCard from "./Productcard";
import { useProduct } from "../context/ProductContext";

type ProductListProps = {
  searchText: string;
  selectedCategory: string;
};

export default function ProductList({
  searchText,
  selectedCategory,
}: ProductListProps) {
  const { products } = useProduct();

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = String(product.name || "")
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filteredProducts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#777",
        }}
      >
        <h3>No products found</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
      }}
    >
      {filteredProducts.map((product: any) => {
        let totalStock = 0;

        /*
          Stock supports all formats used in the app:

          1. Old format:
             stock: 10
             sizes: ["S", "M", "L"]

          2. New format:
             sizes: [
               { name: "S", stock: 10 },
               { name: "M", stock: 5 }
             ]

          3. Alternative size quantity format:
             sizes: [
               { name: "S", quantity: 10 }
             ]
        */

        if (Array.isArray(product.sizes) && product.sizes.length > 0) {
          const hasObjectSizes = product.sizes.some(
            (size: any) =>
              size &&
              typeof size === "object"
          );

          if (hasObjectSizes) {
            totalStock = product.sizes.reduce(
              (total: number, size: any) => {
                if (!size || typeof size !== "object") {
                  return total;
                }

                const sizeStock = Number(
                  size.stock ??
                    size.quantity ??
                    size.availableStock ??
                    0
                );

                return (
                  total +
                  (Number.isFinite(sizeStock) && sizeStock > 0
                    ? sizeStock
                    : 0)
                );
              },
              0
            );

            /*
              If size objects don't contain their own stock,
              use the product-level stock saved by Admin.
            */
            if (totalStock === 0) {
              const productStock = Number(
                product.stock ??
                  product.quantity ??
                  product.availableStock ??
                  0
              );

              totalStock = Number.isFinite(productStock)
                ? Math.max(0, productStock)
                : 0;
            }
          } else {
            /*
              Old format:
              sizes: ["S", "M", "L"]

              Here product.stock is the actual product stock.
              Do NOT multiply it by number of sizes.
            */
            const productStock = Number(
              product.stock ??
                product.quantity ??
                product.availableStock ??
                0
            );

            totalStock = Number.isFinite(productStock)
              ? Math.max(0, productStock)
              : 0;
          }
        } else {
          /*
            Products without size options.
          */
          const productStock = Number(
            product.stock ??
              product.quantity ??
              product.availableStock ??
              0
          );

          totalStock = Number.isFinite(productStock)
            ? Math.max(0, productStock)
            : 0;
        }

        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            mrp={Number(product.mrp)}
            price={Number(product.sellingPrice)}
            image={product.images?.[0] || ""}
            stock={totalStock}
          />
        );
      })}
    </div>
  );
}