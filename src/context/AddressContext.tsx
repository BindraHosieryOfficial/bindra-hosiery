import { createContext, useContext, useEffect, useState } from "react";

const AddressContext = createContext<any>(null);

export default function AddressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addresses, setAddresses] = useState<any[]>(() => {
    const saved = localStorage.getItem("addresses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        setAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export const useAddress = () => useContext(AddressContext);