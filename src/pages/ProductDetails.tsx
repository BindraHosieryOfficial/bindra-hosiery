import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useProduct } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProduct();
  const { cart, setCart } = useCart();
  const { wishlist, setWishlist } = useWishlist();
  const { isGuest } = useAuth();

  const product = products.find(
    (item: any) => Number(item.id) === Number(id)
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h2>Product not found.</h2>
      </main>
    );
  }

  const sellingPrice = Number(product.sellingPrice) || 0;
  const mrp = Number(product.mrp) || 0;

  const discount =
    mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "";

  /*
    Product-level stock is used when the product
    does not have any sizes.
  */

  const productLevelStock = Math.max(
    0,
    Number(
      product.stock ??
        product.quantity ??
        product.availableStock ??
        0
    ) || 0
  );

  /*
    Supports both old and new size formats.
  */

  const normalizedSizes = Array.isArray(product.sizes)
    ? product.sizes
        .map((size: any) => {
          if (typeof size === "string") {
            return {
              name: size.trim(),
              stock: productLevelStock,
            };
          }

          if (!size || typeof size !== "object") {
            return null;
          }

          const stock = Math.max(
            0,
            Number(
              size.stock ??
                size.quantity ??
                size.availableStock ??
                0
            ) || 0
          );

          return {
            name: String(size.name || "").trim(),
            stock,
          };
        })
        .filter(
          (size: any) =>
            size && size.name
        )
    : [];

  const hasSizes = normalizedSizes.length > 0;

  const selectedSizeData = normalizedSizes.find(
    (size: any) =>
      String(size.name).trim() ===
      String(selectedSize).trim()
  );

  /*
    If product has sizes:
    selected size stock is used.

    If product has no sizes:
    product-level stock is used.
  */

  const selectedStock = hasSizes
    ? selectedSizeData?.stock || 0
    : productLevelStock;

  const isWishlisted = wishlist.some(
    (item: any) =>
      Number(item.id) === Number(product.id)
  );

  function handleWishlist() {
    if (isGuest) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      setWishlist(
        wishlist.filter(
          (item: any) =>
            Number(item.id) !==
            Number(product.id)
        )
      );
    } else {
      setWishlist([
        ...wishlist,
        {
          id: product.id,
          name: product.name,
          price: sellingPrice,
          image: image,
        },
      ]);
    }
  }

  function handleSizeSelect(
    sizeName: string,
    stock: number
  ) {
    if (stock <= 0) {
      return;
    }

    setSelectedSize(sizeName);
    setQuantity(1);
  }

  function increaseQuantity() {
    /*
      For products with sizes, size must be selected.

      For products without sizes, quantity
      can increase directly.
    */

    if (hasSizes && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (selectedStock <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    if (quantity >= selectedStock) {
      alert(
        `Only ${selectedStock} item${
          selectedStock === 1 ? "" : "s"
        } available.`
      );
      return;
    }

    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  }

  function handleAddToCart() {
    if (isGuest) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    /*
      Size is required only when the product
      actually has sizes.
    */

    if (hasSizes && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (selectedStock <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    if (quantity > selectedStock) {
      alert(
        `Only ${selectedStock} item${
          selectedStock === 1 ? "" : "s"
        } available.`
      );
      return;
    }

    const existingIndex = cart.findIndex(
      (item: any) =>
        Number(item.id) === Number(product.id) &&
        String(item.size || "").trim() ===
          String(selectedSize || "").trim()
    );

    const updatedCart = [...cart];

    if (existingIndex !== -1) {
      const existingQuantity =
        Number(
          updatedCart[existingIndex].quantity
        ) || 0;

      if (
        existingQuantity + quantity >
        selectedStock
      ) {
        alert(
          `Only ${selectedStock} item${
            selectedStock === 1 ? "" : "s"
          } available.`
        );
        return;
      }

      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity:
          existingQuantity + quantity,
      };
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        price: sellingPrice,
        image: image,

        /*
          Size will be an empty string for
          products that don't have sizes.
        */
        size: selectedSize,

        quantity: quantity,
      });
    }

    setCart(updatedCart);

    alert("Product added to cart.");
  }

  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <img
        src={image}
        alt={product.name}
        style={{
          width: "100%",
          borderRadius: "16px",
          marginBottom: "20px",
          objectFit: "cover",
        }}
      />

      <button
        onClick={handleWishlist}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "fit-content",
          padding: "10px 16px",
          marginBottom: "20px",
          borderRadius: "20px",
          border: "1px solid #555",
          background: "#1a1a1a",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            lineHeight: "1",
            color: isWishlisted
              ? "#e63946"
              : "#fff",
          }}
        >
          {isWishlisted ? "♥" : "♡"}
        </span>

        {isWishlisted
          ? "Wishlisted"
          : "Wishlist"}
      </button>

      <h1>{product.name}</h1>

      <h2 style={{ marginBottom: "5px" }}>
        ₹{sellingPrice}
      </h2>

      {mrp > sellingPrice && (
        <>
          <p
            style={{
              textDecoration: "line-through",
              color: "#777",
              margin: "0",
            }}
          >
            ₹{mrp}
          </p>

          <p
            style={{
              color: "#1b8f3b",
              fontWeight: "700",
              marginTop: "6px",
            }}
          >
            {discount}% OFF
          </p>
        </>
      )}

      <p
        style={{
          marginTop: "20px",
          lineHeight: "1.6",
        }}
      >
        {product.description}
      </p>

      {/* SIZE SECTION ONLY FOR PRODUCTS WITH SIZES */}

      {hasSizes && (
        <>
          <h3>Available Sizes</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "25px",
            }}
          >
            {normalizedSizes.map(
              (size: any) => {
                const isSelected =
                  selectedSize === size.name;

                const isOutOfStock =
                  Number(size.stock) <= 0;

                return (
                  <button
                    key={size.name}
                    disabled={isOutOfStock}
                    onClick={() =>
                      handleSizeSelect(
                        size.name,
                        size.stock
                      )
                    }
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: isSelected
                        ? "2px solid #111"
                        : "1px solid #ccc",
                      background: isSelected
                        ? "#111"
                        : isOutOfStock
                        ? "#f3f3f3"
                        : "#fff",
                      color: isSelected
                        ? "#fff"
                        : isOutOfStock
                        ? "#999"
                        : "#111",
                      cursor: isOutOfStock
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: "600",
                      opacity:
                        isOutOfStock
                          ? 0.6
                          : 1,
                    }}
                  >
                    <div>
                      {size.name}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        marginTop: "4px",
                        fontWeight: "500",
                      }}
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : `${size.stock} available`}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </>
      )}

      {/* SELECTED SIZE INFO */}

      {hasSizes && selectedSize && (
        <p
          style={{
            marginTop: "-10px",
            marginBottom: "20px",
            color: "#555",
            fontWeight: "600",
          }}
        >
          Selected Size: {selectedSize} ·{" "}
          {selectedStock} available
        </p>
      )}

      <h3>Quantity</h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
          style={{
            width: "40px",
            height: "40px",
            cursor:
              quantity <= 1
                ? "not-allowed"
                : "pointer",
          }}
        >
          −
        </button>

        <strong
          style={{
            fontSize: "18px",
          }}
        >
          {quantity}
        </strong>

        <button
          onClick={increaseQuantity}
          disabled={
            selectedStock <= 0 ||
            quantity >= selectedStock
          }
          style={{
            width: "40px",
            height: "40px",
            cursor:
              selectedStock <= 0 ||
              quantity >= selectedStock
                ? "not-allowed"
                : "pointer",
          }}
        >
          +
        </button>
      </div>

      {/* ADD TO CART */}

      <button
        onClick={handleAddToCart}
        disabled={
          (hasSizes && !selectedSize) ||
          selectedStock <= 0
        }
        style={{
          width: "100%",
          padding: "16px",
          background:
            (hasSizes && !selectedSize) ||
            selectedStock <= 0
              ? "#999"
              : "#111",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "600",
          cursor:
            (hasSizes && !selectedSize) ||
            selectedStock <= 0
              ? "not-allowed"
              : "pointer",
        }}
      >
        {hasSizes && !selectedSize
          ? "Select Size"
          : selectedStock <= 0
          ? "Out of Stock"
          : "Add to Cart"}
      </button>
    </main>
  );
}