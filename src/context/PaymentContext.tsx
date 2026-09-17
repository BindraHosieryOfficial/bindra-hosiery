import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type PaymentSettings = {
  upiEnabled: boolean;
  codEnabled: boolean;
  netBankingEnabled: boolean;
  upiId: string;
};

const defaultSettings: PaymentSettings = {
  upiEnabled: true,
  codEnabled: false,
  netBankingEnabled: false,
  upiId: "",
};

const PaymentContext =
  createContext<any>(null);

export default function PaymentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paymentSettings, setPaymentSettings] =
    useState<PaymentSettings>(() => {
      try {
        const saved =
          localStorage.getItem(
            "paymentSettings"
          );

        if (!saved) {
          return defaultSettings;
        }

        const parsed = JSON.parse(saved);

        return {
          ...defaultSettings,
          ...parsed,
        };
      } catch (error) {
        console.error(
          "Failed to load payment settings:",
          error
        );

        return defaultSettings;
      }
    });

  useEffect(() => {
    try {
      localStorage.setItem(
        "paymentSettings",
        JSON.stringify(paymentSettings)
      );
    } catch (error) {
      console.error(
        "Failed to save payment settings:",
        error
      );
    }
  }, [paymentSettings]);

  return (
    <PaymentContext.Provider
      value={{
        paymentSettings,
        setPaymentSettings,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context =
    useContext(PaymentContext);

  if (!context) {
    throw new Error(
      "usePayment must be used inside PaymentProvider"
    );
  }

  return context;
}