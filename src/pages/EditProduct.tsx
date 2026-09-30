import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProduct } from "../context/ProductContext";
import { supabase } from "../lib/supabase";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProduct();

  const product = products.find(
    (p: any) => p.id === Number(id)
  );

  const [editedProduct, setEditedProduct] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
        images: Array.isArray(product.images)
          ? product.images
          : [],
      });
    }
  }, [product]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setEditedProduct({
      ...editedProduct,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setSelectedImages(files);
  }

  async function uploadImages(files: File[]) {
    const uploadedImages: string[] = [];

    for (const file of files) {
      const fileExtension =
        file.name.split(".").pop() || "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const filePath = `products/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
  cacheControl: "3600",
  upsert: false,
  contentType: file.type,
});

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedImages.push(data.publicUrl);
    }

    return uploadedImages;
  }

  async function deleteOldImages(images: string[]) {
    const storagePaths = images
      .filter(
        (image) =>
          typeof image === "string" &&
          image.includes(
            "/storage/v1/object/public/product-images/"
          )
      )
      .map((image) => {
        const marker =
          "/storage/v1/object/public/product-images/";

        const path = image.split(marker)[1];

        return path
          ? decodeURIComponent(path)
          : null;
      })
      .filter(Boolean) as string[];

    if (storagePaths.length === 0) return;

    const { error } = await supabase.storage
      .from("product-images")
      .remove(storagePaths);

    if (error) {
      console.error(
        "Old image deletion error:",
        error
      );
    }
  }

  async function handleSave() {
    if (!editedProduct) return;

    try {
      setUploading(true);

      let finalImages = editedProduct.images || [];
      let oldImages: string[] = [];

      // If new images were selected, upload them
      // and replace the existing images.
      if (selectedImages.length > 0) {
        oldImages = Array.isArray(editedProduct.images)
          ? editedProduct.images
          : [];

        finalImages = await uploadImages(selectedImages);
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: editedProduct.name,
          category: editedProduct.category,
          brand: editedProduct.brand,
          selling_price: Number(
            editedProduct.sellingPrice
          ),
          stock:
            Number(editedProduct.stock) || 0,
          images: finalImages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", Number(id));

      if (error) {
        console.error(
          "Error updating product:",
          error
        );

        alert(
          "Failed to update product. Please try again."
        );

        return;
      }

      // Delete old Storage images only after
      // the database update succeeds.
      if (
        selectedImages.length > 0 &&
        oldImages.length > 0
      ) {
        await deleteOldImages(oldImages);
      }

      alert("Product Updated Successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Product update error:",
        error
      );

      alert(
        "Failed to update product. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  if (!product || !editedProduct) {
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
          onClick={() =>
            navigate("/admin/products")
          }
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

        {/* PRODUCT IMAGES */}

        <p>Product Images</p>

        {editedProduct.images &&
          editedProduct.images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              {editedProduct.images.map(
                (image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                )
              )}
            </div>
          )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        />

        {selectedImages.length > 0 && (
          <p
            style={{
              fontSize: "14px",
              color: "#555",
            }}
          >
            {selectedImages.length} new image
            {selectedImages.length > 1
              ? "s"
              : ""}{" "}
            selected. These will replace the
            existing images.
          </p>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={uploading}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "25px",
          background: uploading
            ? "#777"
            : "#111",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          cursor: uploading
            ? "not-allowed"
            : "pointer",
        }}
      >
        {uploading
          ? "Saving..."
          : "Save Changes"}
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