import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../context/CategoryContext";
import { supabase } from "../lib/supabase";

type SizeStock = {
  name: string;
  stock: number;
};

type ProductColor = {
  name: string;
  images: string[];
};

export default function AddProduct() {
  const navigate = useNavigate();
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
    colors: [] as ProductColor[],
    sizes: [] as SizeStock[],
    stock: 0,
  });

  // Local preview URLs
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [colorImagePreviews, setColorImagePreviews] = useState<
    Record<string, string[]>
  >({});

  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  async function uploadImages(
    files: FileList | null
  ): Promise<{
    urls: string[];
    previews: string[];
  }> {
    if (!files || files.length === 0) {
      return {
        urls: [],
        previews: [],
      };
    }

    const uploadedUrls: string[] = [];
    const previews: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Local preview
      const previewUrl = URL.createObjectURL(file);
      previews.push(previewUrl);

      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);

        URL.revokeObjectURL(previewUrl);

        alert(
          `Image upload failed: ${file.name}\n${uploadError.message}`
        );

        previews.pop();
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      } else {
        URL.revokeObjectURL(previewUrl);
        previews.pop();
      }
    }

    return {
      urls: uploadedUrls,
      previews,
    };
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    const result = await uploadImages(files);

    if (result.urls.length > 0) {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...result.urls],
      }));
    }

    if (result.previews.length > 0) {
      setImagePreviews((prev) => [
        ...prev,
        ...result.previews,
      ]);
    }

    e.target.value = "";
  }

  function addColor() {
    const colorName = newColor.trim();

    if (!colorName) {
      alert("Please enter a color name.");
      return;
    }

    const alreadyExists = product.colors.some(
      (color) =>
        color.name.toLowerCase() === colorName.toLowerCase()
    );

    if (alreadyExists) {
      alert("This color is already added.");
      return;
    }

    setProduct((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          name: colorName,
          images: [],
        },
      ],
    }));

    setColorImagePreviews((prev) => ({
      ...prev,
      [colorName]: [],
    }));

    setNewColor("");
  }

  function removeColor(colorName: string) {
    const previews = colorImagePreviews[colorName] || [];

    previews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter(
        (color) => color.name !== colorName
      ),
    }));

    setColorImagePreviews((prev) => {
      const updated = { ...prev };
      delete updated[colorName];
      return updated;
    });
  }

  async function handleColorImagesUpload(
    colorName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    const result = await uploadImages(files);

    if (result.urls.length > 0) {
      setProduct((prev) => ({
        ...prev,
        colors: prev.colors.map((color) =>
          color.name === colorName
            ? {
                ...color,
                images: [
                  ...color.images,
                  ...result.urls,
                ],
              }
            : color
        ),
      }));
    }

    if (result.previews.length > 0) {
      setColorImagePreviews((prev) => ({
        ...prev,
        [colorName]: [
          ...(prev[colorName] || []),
          ...result.previews,
        ],
      }));
    }

    e.target.value = "";
  }

  function removeColorImage(
    colorName: string,
    imageIndex: number
  ) {
    const previewUrl =
      colorImagePreviews[colorName]?.[imageIndex];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.map((color) =>
        color.name === colorName
          ? {
              ...color,
              images: color.images.filter(
                (_, index) => index !== imageIndex
              ),
            }
          : color
      ),
    }));

    setColorImagePreviews((prev) => ({
      ...prev,
      [colorName]: (prev[colorName] || []).filter(
        (_, index) => index !== imageIndex
      ),
    }));
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
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
        item.name.toLowerCase() ===
        sizeName.toLowerCase()
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

  async function handleSaveProduct() {
    if (!product.name || !product.category) {
      alert(
        "Please fill Product Name and Category."
      );
      return;
    }

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

    const { error } = await supabase
      .from("products")
      .insert({
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        mrp: Number(newProduct.mrp),
        selling_price: Number(
          newProduct.sellingPrice
        ),
        age_group: newProduct.ageGroup,
        description: newProduct.description,
        images: newProduct.images,
        colors: newProduct.colors,
        sizes: newProduct.sizes,
        stock: newProduct.stock,
      });

    if (error) {
      console.error(
        "Error adding product:",
        error
      );

      alert(
        "Failed to add product. Please try again."
      );

      return;
    }

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
              addCategory(
                newCategory.trim()
              );

              setProduct((prev) => ({
                ...prev,
                category:
                  newCategory.trim(),
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

      <p>
        <strong>Product Images</strong>
      </p>

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
        {imagePreviews.map(
          (image, index) => (
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
          )
        )}
      </div>

      <div
        style={{
          marginTop: "10px",
          marginBottom: "25px",
        }}
      >
        <p>
          <strong>
            Product Colors (Optional)
          </strong>
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
            value={newColor}
            onChange={(e) =>
              setNewColor(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addColor();
              }
            }}
            placeholder="Enter color (e.g. Pink)"
            style={{
              ...inputStyle,
              marginBottom: 0,
              flex: 1,
            }}
          />

          <button
            type="button"
            onClick={addColor}
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
            + Add Color
          </button>
        </div>

        {product.colors.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {product.colors.map(
              (color) => {
                const previews =
                  colorImagePreviews[
                    color.name
                  ] || [];

                return (
                  <div
                    key={color.name}
                    style={{
                      padding: "15px",
                      border:
                        "1px solid #ddd",
                      borderRadius: "12px",
                      background: "#fafafa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {color.name}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          removeColor(
                            color.name
                          )
                        }
                        style={{
                          border: "none",
                          background: "#fff",
                          color: "#d32f2f",
                          cursor:
                            "pointer",
                          fontWeight:
                            "700",
                          fontSize: "18px",
                        }}
                        title="Remove color"
                      >
                        ×
                      </button>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleColorImagesUpload(
                          color.name,
                          e
                        )
                      }
                    />

                    {previews.length > 0 && (
                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px",
                          flexWrap:
                            "wrap",
                          marginTop:
                            "12px",
                        }}
                      >
                        {previews.map(
                          (
                            image,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              style={{
                                position:
                                  "relative",
                              }}
                            >
                              <img
                                src={image}
                                alt={`${color.name} ${
                                  index + 1
                                }`}
                                style={{
                                  width:
                                    "80px",
                                  height:
                                    "80px",
                                  objectFit:
                                    "cover",
                                  borderRadius:
                                    "10px",
                                  border:
                                    "1px solid #ddd",
                                }}
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeColorImage(
                                    color.name,
                                    index
                                  )
                                }
                                style={{
                                  position:
                                    "absolute",
                                  top:
                                    "-6px",
                                  right:
                                    "-6px",
                                  width:
                                    "22px",
                                  height:
                                    "22px",
                                  border:
                                    "none",
                                  borderRadius:
                                    "50%",
                                  background:
                                    "#111",
                                  color:
                                    "#fff",
                                  cursor:
                                    "pointer",
                                  fontSize:
                                    "14px",
                                  lineHeight:
                                    "22px",
                                  padding:
                                    0,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
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
            <strong>
              Stock by Size
            </strong>
          </p>

          {product.sizes.map(
            (size) => (
              <div
                key={size.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                  padding: "12px",
                  border:
                    "1px solid #ddd",
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
                    border:
                      "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    removeSize(
                      size.name
                    )
                  }
                  style={{
                    border: "none",
                    background: "#fff",
                    color: "#d32f2f",
                    cursor:
                      "pointer",
                    fontWeight: "700",
                    fontSize: "18px",
                  }}
                  title="Remove size"
                >
                  ×
                </button>
              </div>
            )
          )}
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
            No sizes added. This
            product will use
            product-level stock.
          </p>

          <Input
            label="Stock Quantity"
            name="stock"
            value={String(
              product.stock
            )}
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