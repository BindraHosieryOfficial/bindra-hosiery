import type { ChangeEvent } from "react";
type SearchBarProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({
  searchText,
  setSearchText,
}: SearchBarProps) {
  return (
    <div style={{ margin: "20px 0" }}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchText}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchText(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />
    </div>
  );
}