import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<any>(null);

type User = {
  name: string;
  mobile: string;
  email: string;
};

const emptyUser: User = {
  name: "",
  mobile: "",
  email: "",
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGuest, setIsGuest] = useState(() => {
    const saved = localStorage.getItem("isGuest");
    return saved ? JSON.parse(saved) : true;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem("isLoggedIn");
    return saved ? JSON.parse(saved) : false;
  });

  const [user, setUserState] = useState<User>(() => {
    try {
      const saved = localStorage.getItem("user");

      return saved ? JSON.parse(saved) : emptyUser;
    } catch {
      return emptyUser;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "isGuest",
      JSON.stringify(isGuest)
    );
  }, [isGuest]);

  useEffect(() => {
    localStorage.setItem(
      "isLoggedIn",
      JSON.stringify(isLoggedIn)
    );
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  }, [user]);

  // Save the currently logged-in user's profile
  function setUser(updatedUser: User) {
    setUserState(updatedUser);

    if (updatedUser.mobile) {
      try {
        const savedCustomers =
          localStorage.getItem("customers");

        const customers = savedCustomers
          ? JSON.parse(savedCustomers)
          : {};

        customers[updatedUser.mobile] = updatedUser;

        localStorage.setItem(
          "customers",
          JSON.stringify(customers)
        );
      } catch (error) {
        console.error(
          "Failed to save customer profile:",
          error
        );
      }
    }
  }

  // Login using mobile number
  function login(mobile: string) {
    try {
      const savedCustomers =
        localStorage.getItem("customers");

      const customers = savedCustomers
        ? JSON.parse(savedCustomers)
        : {};

      const existingCustomer = customers[mobile];

      if (existingCustomer) {
        setUserState(existingCustomer);
      } else {
        const newUser: User = {
          name: "",
          mobile,
          email: "",
        };

        setUserState(newUser);

        customers[mobile] = newUser;

        localStorage.setItem(
          "customers",
          JSON.stringify(customers)
        );
      }

      setIsGuest(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(
        "Login customer error:",
        error
      );

      const newUser: User = {
        name: "",
        mobile,
        email: "",
      };

      setUserState(newUser);
      setIsGuest(false);
      setIsLoggedIn(true);
    }
  }

  function logout() {
    setIsLoggedIn(false);
    setIsGuest(true);

    setUserState(emptyUser);
  }

  return (
    <AuthContext.Provider
      value={{
        isGuest,
        setIsGuest,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);