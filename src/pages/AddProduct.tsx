import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { useCategory } from "../context/CategoryContext";

type SizeStock = {
  name: string;
  stock: number;
};

export default function AddProduct() {
  const navigate = useNavigate();
  const { products, setProducts } = useProduct();
  const { categories, addCategory } = useCategory();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    brand: "Bindra Hosiery",
    mrp: "",
    sellingPrice: "",
    ageGroup: "",
    description: "",
    images: [] as string[],
    sizes: [] as SizeStock[],
    stock: 0,
  });

  const [newSize, setNewSize] = useState("");

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve(reader.result as string);
            };

            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setProduct((prev) => ({
        ...prev,
        images,
      }));
    });
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function addSize() {
    const sizeName = newSize.trim();

    if (!sizeName) {
      alert("Please enter a size.");
      return;
    }

    const alreadyExists = product.sizes.some(
      (item) =>
        item.name.toLowerCase() === sizeName.toLowerCase()
    );

    if (alreadyExists) {
      alert("This size is already added.");
      return;
    }

    setProduct((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          name: sizeName,
          stock: 0,
        },
      ],
    }));

    setNewSize("");
  }

  function removeSize(sizeName: string) {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter(
        (item) => item.name !== sizeName
      ),
    }));
  }

  function updateSizeStock(
    sizeName: string,
    stockValue: string
  ) {
    const stock = Math.max(
      0,
      Number(stockValue) || 0
    );

    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item) =>
        item.name === sizeName
          ? {
              ...item,
              stock,
            }
          : item
      ),
    }));
  }

  function handleSaveProduct() {
    if (!product.name || !product.category) {
      alert("Please fill Product Name and Category.");
      return;
    }

    /*
      If sizes are added:
      stock is managed size-wise.

      If no sizes are added:
      stock is managed at product level.
    */

    const newProduct = {
      id: Date.now(),
      ...product,
      stock:
        product.sizes.length > 0
          ? 0
          : Math.max(
              0,
              Number(product.stock) || 0
            ),
      createdAt: new Date().toISOString(),
    };

    setProducts([...products, newProduct]);

    alert("Product Added Successfully!");

    navigate("/admin/products");
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "25px" }}>
        Add Product
      </h1>

      <Input
        label="Product Name"
        name="name"
        value={product.name}
        onChange={handleChange}
      />

      <p>Category</p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          style={{
            ...inputStyle,
            flex: 1,
          }}
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            const newCategory = prompt(
              "Enter new category name:"
            );

            if (newCategory?.trim()) {
              addCategory(newCategory.trim());

              setProduct((prev) => ({
                ...prev,
                category: newCategory.trim(),
              }));
            }
          }}
          style={{
            padding: "10px 14px",
            border: "1px solid #111",
            borderRadius: "6px",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Add Category
        </button>
      </div>

      <Input
        label="MRP"
        name="mrp"
        value={product.mrp}
        onChange={handleChange}
      />

      <Input
        label="Selling Price"
        name="sellingPrice"
        value={product.sellingPrice}
        onChange={handleChange}
      />

      <p>Product Images</p>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt=""
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        ))}
      </div>

      <p>
        <strong>Sizes (Optional)</strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <input
          type="text"
          value={newSize}
          onChange={(e) =>
            setNewSize(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSize();
            }
          }}
          placeholder="Enter size (e.g. M, XL, 6-8Y)"
          style={{
            ...inputStyle,
            marginBottom: 0,
            flex: 1,
          }}
        />

        <button
          type="button"
          onClick={addSize}
          style={{
            padding: "10px 14px",
            border: "1px solid #111",
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontWeight: "600",
          }}
        >
          + Add Size
        </button>
      </div>

      {product.sizes.length > 0 ? (
        <>
          <p>
            <strong>Stock by Size</strong>
          </p>

          {product.sizes.map((size) => (
            <div
              key={size.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <strong
                style={{
                  flex: 1,
                }}
              >
                {size.name}
              </strong>

              <input
                type="number"
                min="0"
                value={size.stock}
                onChange={(e) =>
                  updateSizeStock(
                    size.name,
                    e.target.value
                  )
                }
                placeholder="Stock"
                style={{
                  width: "100px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  removeSize(size.name)
                }
                style={{
                  border: "none",
                  background: "#fff",
                  color: "#d32f2f",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "18px",
                }}
                title="Remove size"
              >
                ×
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          <p
            style={{
              color: "#777",
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            No sizes added. This product will use
            product-level stock.
          </p>

          <Input
            label="Stock Quantity"
            name="stock"
            value={String(product.stock)}
            onChange={handleChange}
          />
        </>
      )}

      <p>Description</p>

      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        rows={5}
        style={inputStyle}
      />

      <button
        onClick={handleSaveProduct}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "25px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Save Product
      </button>
    </main>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <>
      <p>{label}</p>

      <input
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      />
    </>
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