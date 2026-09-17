import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";

export default function AdminProducts() {
  const navigate = useNavigate();

 const { products, setProducts } = useProduct();
  
function handleDelete(id: number) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  setProducts(
    products.filter((product: any) => product.id !== id)
  );
}
  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1>Products</h1>

        <button
          onClick={() => navigate("/admin/products/add")}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>

      {products.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
            color: "#666",
          }}
        >
          No Products Added Yet
        </div>
      ) : (
        products.map((product: any) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "15px",
            }}
          >
            {product.images?.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
            )}

            <h3>{product.name}</h3>

            <p>Category: {product.category}</p>

            <p>Brand: {product.brand}</p>

            <p>Price: ₹{product.sellingPrice}</p>

            <p>Stock: {product.stock}</p>
            <button
  onClick={() =>
    navigate(`/admin/products/edit/${product.id}`)
  }
  style={{
    marginTop: "12px",
    marginRight: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  ✏️ Edit
</button>
            <button
  onClick={() => handleDelete(product.id)}
  style={{
    marginTop: "12px",
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  🗑 Delete
</button>
          </div>
        ))
      )}
    </main>
  );
}