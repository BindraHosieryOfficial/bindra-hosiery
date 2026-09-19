import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useAddress } from "../context/AddressContext";
import { useAuth } from "../context/AuthContext";
import { useProduct } from "../context/ProductContext";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment() {
  const { cart, setCart } = useCart();
  const { orders, setOrders } = useOrder();
  const navigate = useNavigate();

  const { addresses } = useAddress();
  const { user } = useAuth();
  const { decreaseStock } = useProduct();

  const [isProcessing, setIsProcessing] =
    useState(false);

  const selectedAddress =
    addresses.find(
      (address: any) => address.isDefault
    ) || addresses[0];

  if (cart.length === 0) {
    return (
      <main
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>Your cart is empty.</h2>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "14px 24px",
            marginTop: "20px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  const subtotal = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  const gstEnabled = false;

  const isDelhiNCR =
    selectedAddress?.pincode?.startsWith("11");

  let deliveryCharge = 100;

  if (isDelhiNCR) {
    deliveryCharge =
      subtotal >= 3000 ? 0 : 50;
  } else {
    if (subtotal >= 5000) {
      deliveryCharge = 0;
    } else if (subtotal >= 3000) {
      deliveryCharge = 50;
    } else {
      deliveryCharge = 100;
    }
  }

  const gstAmount = gstEnabled
    ? subtotal * 0.18
    : 0;

  const grandTotal =
    subtotal + deliveryCharge + gstAmount;

  async function handlePayment() {
    if (isProcessing) return;

    if (!selectedAddress) {
      alert(
        "Please select a delivery address."
      );
      navigate("/checkout");
      return;
    }

    setIsProcessing(true);

    try {
      // STEP 1:
      // Create Razorpay Order through backend

      const orderResponse = await fetch(
        "https://bindra-hosiery.onrender.com/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: grandTotal,
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error(
          "Failed to create Razorpay order."
        );
      }

      const razorpayOrder =
        await orderResponse.json();

      // STEP 2:
      // Load Razorpay Checkout

      const loadRazorpay = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }

          const script =
            document.createElement("script");

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload = () =>
            resolve(true);

          script.onerror = () =>
            resolve(false);

          document.body.appendChild(script);
        });
      };

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay failed to load."
        );
      }

      // STEP 3:
      // Razorpay Checkout Options

      const options = {
       key: import.meta.env.VITE_RAZORPAY_KEY_ID,

amount: razorpayOrder.amount,

currency: "INR",
        name: "Bindra Hosiery",

        description:
          "Bindra Hosiery Order Payment",

        order_id: razorpayOrder.id,

        handler: async function (
          paymentResponse: any
        ) {
          try {
            // STEP 4:
            // Verify payment through backend

            const verifyResponse =
              await fetch(
                "https://bindra-hosiery.onrender.com/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse.razorpay_signature,
                  }),
                }
              );

            const verificationResult =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verificationResult.success
            ) {
              console.error(
                "Payment verification failed:",
                verificationResult
              );

              alert(
                "Payment verification failed. Please contact support."
              );

              setIsProcessing(false);
              return;
            }

            console.log(
              "Payment verified successfully:",
              paymentResponse
            );

            // STEP 5:
            // Create order only after
            // successful payment verification

            const newOrder = {
              id: Date.now(),

              items: cart,

              total: grandTotal,

              status: "Order Placed",

              date:
                new Date().toISOString(),

              createdAt:
                new Date().toISOString(),

              paymentMethod:
                "UPI / Razorpay",

              paymentId:
                paymentResponse
                  .razorpay_payment_id,

              razorpayOrderId:
                paymentResponse
                  .razorpay_order_id,

              customer: {
                name: user.name,
                mobile: user.mobile,
                email: user.email,
              },

              deliveryAddress:
                selectedAddress,
            };

            setOrders([
              ...orders,
              newOrder,
            ]);

            // STEP 6:
            // Decrease stock

            cart.forEach((item: any) => {
              console.log(
                "ORDER STOCK DEBUG:",
                {
                  productId: item.id,
                  productName: item.name,
                  selectedSize:
                    item.size,
                  quantity:
                    item.quantity,
                }
              );

              decreaseStock(
                item.id,
                item.size,
                item.quantity
              );
            });

            // STEP 7:
            // Clear cart

            setCart([]);

            setIsProcessing(false);

            // STEP 8:
            // Order success page

            navigate("/order-success");
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              "Payment verification failed. Please try again."
            );

            setIsProcessing(false);
          }
        },

        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.mobile || "",
        },

        theme: {
          color: "#111111",
        },

        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        "Unable to start payment. Please try again."
      );

      setIsProcessing(false);
    }
  }
    return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Payment</h1>

      <h3>Order Summary</h3>

      {cart.map(
        (item: any, index: number) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "15px",
              padding: "15px",
              border:
                "1px solid #e5e5e5",
              borderRadius: "12px",
              marginBottom: "15px",
              background: "#fff",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <div
              style={{
                flex: 1,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                }}
              >
                {item.name}
              </h3>

              <p
                style={{
                  margin: "6px 0",
                  color: "#666",
                }}
              >
                Size: {item.size}
              </p>

              <p
                style={{
                  margin: "6px 0",
                  color: "#666",
                }}
              >
                Qty: {item.quantity}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "10px",
                  fontWeight: "600",
                }}
              >
                <span>
                  ₹{item.price} ×{" "}
                  {item.quantity}
                </span>

                <span>
                  ₹
                  {item.price *
                    item.quantity}
                </span>
              </div>
            </div>
          </div>
        )
      )}

      <hr />

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginTop: "10px",
        }}
      >
        <span>Subtotal</span>

        <strong>
          ₹{subtotal}
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginTop: "8px",
        }}
      >
        <span>Delivery</span>

        <strong>
          {deliveryCharge === 0
            ? "FREE"
            : `₹${deliveryCharge}`}
        </strong>
      </div>

      {gstEnabled && (
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginTop: "8px",
          }}
        >
          <span>GST</span>

          <strong>
            ₹{gstAmount}
          </strong>
        </div>
      )}

      <hr />

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        <span>
          Grand Total
        </span>

        <span>
          ₹{grandTotal}
        </span>
      </div>

      <hr
        style={{
          margin: "25px 0",
        }}
      />

      <h3>Payment Method</h3>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "15px",
          marginTop: "15px",
        }}
      >
        <input
          type="radio"
          checked
          readOnly
        />

        <span
          style={{
            marginLeft: "10px",
          }}
        >
          UPI Payment
        </span>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "30px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          cursor: isProcessing
            ? "not-allowed"
            : "pointer",
          opacity: isProcessing
            ? 0.6
            : 1,
        }}
      >
        {isProcessing
          ? "Processing..."
          : "Pay Now"}
      </button>
    </main>
  );
}
