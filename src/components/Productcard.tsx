import { useNavigate } from "react-router-dom";

type ProductcardProps = {
  id: number;
  name: string;
  price: number;
  mrp: number;
  image: string;
  stock: number;
};

export default function Productcard({
  id,
  name,
  price,
  mrp,
  image,
  stock,
}: ProductcardProps) {
  const navigate = useNavigate();

  const discount =
    mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  async function handleShare(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${id}`;

    const shareData = {
      title: name,
      text: `Check out ${name} on Bindra Hosiery`,
      url: productUrl,
    };

    try {
      if (
        navigator.share &&
        /Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        )
      ) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(productUrl);

      alert("Product link copied!");
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(productUrl);
        alert("Product link copied!");
      } catch {
        alert(`Copy this product link:\n${productUrl}`);
      }
    }
  }

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      style={{
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        borderRadius: "18px",
        padding: "16px",
        background: "#fff",
        marginTop: "20px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: "220px",
          background: "#f2f2f2",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "12px",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <h3
        style={{
          margin: "12px 0 8px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#222",
        }}
      >
        {name}
      </h3>

      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          ₹{price}
        </div>

        {mrp > price && (
          <>
            <div
              style={{
                textDecoration: "line-through",
                color: "#888",
                fontSize: "14px",
              }}
            >
              ₹{mrp}
            </div>

            <div
              style={{
                color: "#1b8f3b",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              {discount}% OFF
            </div>
          </>
        )}
      </div>

      {stock === 0 ? (
        <div
          style={{
            marginBottom: "12px",
            color: "#d32f2f",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          Out of Stock
        </div>
      ) : stock <= 2 ? (
        <div
          style={{
            marginBottom: "12px",
            color: "#e67e00",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          Only {stock} left
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: "8px",
          width: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            background: "#f5f5f5",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "14px",
            color: "#111",
            boxSizing: "border-box",
          }}
        >
          View Details
        </div>

        <button
          type="button"
          onClick={handleShare}
          style={{
          padding: "10px",
borderRadius: "10px",
background: "#f5f5f5",
color: "#111",
border: "none",
flex: 1,
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Share ↗
        </button>
      </div>
    </div>
  );
}