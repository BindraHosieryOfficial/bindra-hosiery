import { useCategory } from "../context/CategoryContext";

type CategoryButtonsProps = {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<string>
  >;
};

export default function CategoryButtons({
  selectedCategory,
  setSelectedCategory,
}: CategoryButtonsProps) {
  const { categories } = useCategory();

  const allCategories = [
    "All",
    ...categories.filter(
      (category) => category !== "All"
    ),
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        margin: "20px 0",
      }}
    >
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          style={{
            padding: "12px 20px",
            border: "1px solid #ccc",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            background:
              selectedCategory === category
                ? "#111"
                : "#fff",
            color:
              selectedCategory === category
                ? "#fff"
                : "#222",
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}