import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const defaultCategories = [
  "Rompers",
  "Socks",
  "Thermals",
  "Vest",
];

type CategoryContextType = {
  categories: string[];
  setCategories: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
};

const CategoryContext =
  createContext<CategoryContextType | null>(null);

export default function CategoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<string[]>(
    () => {
      const saved =
        localStorage.getItem("categories");

      if (saved) {
        return JSON.parse(saved);
      }

      return defaultCategories;
    }
  );

  useEffect(() => {
    localStorage.setItem(
      "categories",
      JSON.stringify(categories)
    );
  }, [categories]);

  function addCategory(category: string) {
    const cleanedCategory = category.trim();

    if (!cleanedCategory) {
      return;
    }

    const alreadyExists = categories.some(
      (item) =>
        item.toLowerCase() ===
        cleanedCategory.toLowerCase()
    );

    if (alreadyExists) {
      alert("Category already exists.");
      return;
    }

    setCategories([
      ...categories,
      cleanedCategory,
    ]);
  }

  function deleteCategory(category: string) {
    setCategories(
      categories.filter(
        (item) => item !== category
      )
    );
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategories,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error(
      "useCategory must be used inside CategoryProvider"
    );
  }

  return context;
}