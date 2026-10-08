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
  const [selectedColor, setSelectedColor] = useState("");

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

  const colors = Array.isArray(product.colors)
    ? product.colors.filter(
        (color: any) =>
          color &&
          String(color.name || "").trim()
      )
    : [];

  const hasColors = colors.length > 0;

  const activeColor = hasColors
    ? colors.find(
        (color: any) =>
          String(color.name).trim() ===
          String(selectedColor).trim()
      ) || colors[0]
    : null;

  const activeColorImages =
    activeColor &&
    Array.isArray(activeColor.images)
      ? activeColor.images
      : [];

  const productImages =
    hasColors && activeColorImages.length > 0
      ? activeColorImages
      : Array.isArray(product.images)
      ? product.images
      : [];

  const image =
    productImages.length > 0
      ? productImages[0]
      : "";

  const productLevelStock = Math.max(
    0,
    Number(
      product.stock ??
        product.quantity ??
        product.availableStock ??
        0
    ) || 0
  );

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

  const selectedStock = hasSizes
    ? selectedSizeData?.stock || 0
    : productLevelStock;

  const isWishlisted = wishlist.some(
    (item: any) =>
      Number(item.id) === Number(product.id)
  );

  function handleColorSelect(colorName: string) {
    setSelectedColor(colorName);
  }

  async function handleShare() {
    const productUrl =
      `${window.location.origin}/product/${product.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at Bindra Hosiery`,
          url: productUrl,
        });
      } else {
        await navigator.clipboard.writeText(productUrl);
        alert("Product link copied!");
      }
    } catch {
      // User cancelled the share
    }
  }

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
          color: activeColor?.name || "",
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

  function validatePurchase() {
    if (isGuest) {
      alert("Please login first.");
      navigate("/login");
      return false;
    }

    if (hasSizes && !selectedSize) {
      alert("Please select a size.");
      return false;
    }

    if (selectedStock <= 0) {
      alert("This product is currently out of stock.");
      return false;
    }

    if (quantity > selectedStock) {
      alert(
        `Only ${selectedStock} item${
          selectedStock === 1 ? "" : "s"
        } available.`
      );
      return false;
    }

    return true;
  }

  function handleAddToCart() {
    if (!validatePurchase()) {
      return;
    }

    const existingIndex = cart.findIndex(
      (item: any) =>
        Number(item.id) === Number(product.id) &&
        String(item.size || "").trim() ===
          String(selectedSize || "").trim() &&
        String(item.color || "").trim() ===
          String(activeColor?.name || "").trim()
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
        size: selectedSize,
        color: activeColor?.name || "",
        quantity: quantity,
      });
    }

    setCart(updatedCart);

    alert("Product added to cart.");
  }

  function handleBuyNow() {
    if (!validatePurchase()) {
      return;
    }

    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: sellingPrice,
      image: image,
      size: selectedSize,
      color: activeColor?.name || "",
      quantity: quantity,
    };

    setCart([buyNowItem]);

    navigate("/checkout");
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

      {productImages.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            marginBottom: "20px",
          }}
        >
          {productImages.map(
            (img: string, index: number) => (
              <img
                key={`${img}-${index}`}
                src={img}
                alt={`${product.name} ${index + 1}`}
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border:
                    index === 0
                      ? "2px solid #111"
                      : "1px solid #ddd",
                  flexShrink: 0,
                }}
              />
            )
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handleWishlist}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #555",
            background: "#1a1a1a",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxSizing: "border-box",
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

        <button
          type="button"
          onClick={handleShare}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            background: "#f5f5f5",
            color: "#111",
            border: "none",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          Share ↗
        </button>
      </div>

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

      {hasColors && (
        <>
          <h3 style={{ marginTop: "20px" }}>
            Color
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {colors.map((color: any) => {
              const colorName = String(
                color.name
              ).trim();

              const isSelected =
                colorName ===
                String(
                  activeColor?.name || ""
                ).trim();

              return (
                <button
                  key={colorName}
                  onClick={() =>
                    handleColorSelect(colorName)
                  }
                  style={{
                    padding: "10px 16px",
                    borderRadius: "20px",
                    border: isSelected
                      ? "2px solid #fff"
                      : "1px solid #333",
                    background: isSelected
                      ? "#fff"
                      : "#111",
                    color: isSelected
                      ? "#111"
                      : "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {colorName}
                </button>
              );
            })}
          </div>
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
                        isOutOfStock ? 0.6 : 1,
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

      <button
        onClick={handleBuyNow}
        disabled={
          (hasSizes && !selectedSize) ||
          selectedStock <= 0
        }
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "12px",
          background:
            (hasSizes && !selectedSize) ||
            selectedStock <= 0
              ? "#999"
              : "#fff",
          color:
            (hasSizes && !selectedSize) ||
            selectedStock <= 0
              ? "#fff"
              : "#111",
          border: "1px solid #111",
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
          : "Buy Now"}
      </button>
    </main>
  );
}