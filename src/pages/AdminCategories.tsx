import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../context/CategoryContext";

export default function AdminCategories() {
  const navigate = useNavigate();

  const {
    categories,
    addCategory,
    deleteCategory,
  } = useCategory();

  const [newCategory, setNewCategory] =
    useState("");

  function handleAddCategory() {
    if (!newCategory.trim()) {
      alert("Please enter a category name.");
      return;
    }

    addCategory(newCategory);

    setNewCategory("");
  }

  function handleDeleteCategory(
    category: string
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteCategory(category);
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Categories</h1>

      <button
        onClick={() => navigate("/admin")}
        style={{
          padding: "10px 16px",
          marginBottom: "25px",
          border: "none",
          borderRadius: "8px",
          background: "#eee",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <h3>Add New Category</h3>

      <input
        value={newCategory}
        onChange={(e) =>
          setNewCategory(e.target.value)
        }
        placeholder="Enter category name"
        style={{
          width: "100%",
          padding: "14px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleAddCategory}
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "12px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Add Category
      </button>

      <h3 style={{ marginTop: "30px" }}>
        Existing Categories
      </h3>

      {categories.length === 0 ? (
        <p style={{ color: "#777" }}>
          No categories available.
        </p>
      ) : (
        categories.map((category) => (
          <div
            key={category}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <strong>{category}</strong>

            <button
              onClick={() =>
                handleDeleteCategory(category)
              }
              style={{
                padding: "8px 12px",
                background: "#fff",
                color: "#c00",
                border: "1px solid #c00",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </main>
  );
}