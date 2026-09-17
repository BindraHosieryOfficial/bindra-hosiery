import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "../context/ProductContext";

export default function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { products, setProducts } = useProduct();

  const product = products.find(
    (p: any) => p.id === Number(id)
  );
  const [editedProduct, setEditedProduct] = useState(product);

function handleChange(
  e: React.ChangeEvent<HTMLInputElement>
) {
  setEditedProduct({
    ...editedProduct,
    [e.target.name]: e.target.value,
  });
}

function handleSave() {
  const updatedProducts = products.map((p: any) =>
    p.id === product.id ? editedProduct : p
  );

  setProducts(updatedProducts);

  alert("Product Updated Successfully!");

  navigate("/admin/products");
}

  if (!product) {
    return (
      <main
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h2>Product not found.</h2>

        <button
          onClick={() => navigate("/admin/products")}
          style={{
            marginTop: "20px",
            padding: "12px 18px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Edit Product</h1>

      <div
  style={{
    marginTop: "20px",
  }}
>
  <p>Product Name</p>

  <input
    name="name"
    value={editedProduct.name}
    onChange={handleChange}
    style={inputStyle}
  />

  <p>Category</p>

  <input
    name="category"
    value={editedProduct.category}
    onChange={handleChange}
    style={inputStyle}
  />

  <p>Brand</p>

  <input
    name="brand"
    value={editedProduct.brand}
    onChange={handleChange}
    style={inputStyle}
  />

  <p>Selling Price</p>

  <input
    name="sellingPrice"
    value={editedProduct.sellingPrice}
    onChange={handleChange}
    style={inputStyle}
  />

  <p>Stock</p>

  <input
    name="stock"
    value={editedProduct.stock}
    onChange={handleChange}
    style={inputStyle}
  />
</div>

      <button
  onClick={handleSave}
  style={{
    width: "100%",
    padding: "16px",
    marginTop: "25px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  Save Changes
</button>
    </main>
  );
}
const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};