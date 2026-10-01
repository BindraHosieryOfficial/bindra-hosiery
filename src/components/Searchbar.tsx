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
    <div
      style={{
        width: "100%",
        margin: "20px 0",
        boxSizing: "border-box",
      }}
    >
      <input
        type="text"
        placeholder="Search products..."
        value={searchText}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchText(e.target.value)
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
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