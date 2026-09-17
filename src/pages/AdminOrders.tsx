import { useState } from "react";
import { useOrder } from "../context/OrderContext";

export default function AdminOrders() {
  const { orders, setOrders } = useOrder();
    const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [timePeriod, setTimePeriod] =
    useState("All Time");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");
  const [cancelOrderId, setCancelOrderId] =
  useState<number | null>(null);

const [cancelReason, setCancelReason] =
  useState("");

const [otherReason, setOtherReason] =
  useState("");

 function updateStatus(id: number, status: string) {
  const currentOrder = orders.find(
    (order: any) => order.id === id
  );

  if (!currentOrder) return;

  if (status === "Cancelled") {
    setCancelOrderId(id);
    setCancelReason("");
    setOtherReason("");
    return;
  }

  const updatedOrder = {
    ...currentOrder,
    status,
  };

  setOrders(
    orders.map((order: any) =>
      order.id === id ? updatedOrder : order
    )
  );
}
  const filteredOrders = [...orders]
    .reverse()
    .filter((order: any) => {
      // Search filter
      const search = searchText.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(order.id).includes(search) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(search) ||
        String(order.customer?.mobile || "").includes(search);

      // Status filter
      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      // Date filter
      let matchesDate = true;

      if (timePeriod !== "All Time") {
        const orderDate = new Date(
          order.createdAt || 0
        );

        const now = new Date();

        if (timePeriod === "Today") {
          matchesDate =
            orderDate.toDateString() ===
            now.toDateString();
        }

        if (timePeriod === "Last 7 Days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(
            now.getDate() - 7
          );

          matchesDate =
            orderDate >= sevenDaysAgo &&
            orderDate <= now;
        }

        if (timePeriod === "Last 30 Days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(
            now.getDate() - 30
          );

          matchesDate =
            orderDate >= thirtyDaysAgo &&
            orderDate <= now;
        }

        if (timePeriod === "Last 365 Days") {
          const yearAgo = new Date();
          yearAgo.setDate(
            now.getDate() - 365
          );

          matchesDate =
            orderDate >= yearAgo &&
            orderDate <= now;
        }

        if (timePeriod === "Custom") {
          if (fromDate) {
            const startDate = new Date(fromDate);
            startDate.setHours(0, 0, 0, 0);

            if (orderDate < startDate) {
              matchesDate = false;
            }
          }

          if (toDate) {
            const endDate = new Date(toDate);
            endDate.setHours(
              23,
              59,
              59,
              999
            );

            if (orderDate > endDate) {
              matchesDate = false;
            }
          }
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Admin Orders</h1>
            {/* Search & Filters */}

      <div
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
        }}
      >
        <input
          type="text"
          placeholder="Search Order ID, Name or Mobile"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          style={{
            width: "100%",
            padding: "13px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontSize: "15px",
            boxSizing: "border-box",
            marginBottom: "12px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            width: "100%",
            padding: "13px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontSize: "15px",
            marginBottom: "12px",
            background: "#fff",
            color: "#111",
          }}
        >
          <option value="All">
            All Orders
          </option>

          <option value="Order Placed">
            Order Placed
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Packed">
            Packed
          </option>

          <option value="Shipped">
            Shipped
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        <select
          value={timePeriod}
          onChange={(e) =>
            setTimePeriod(e.target.value)
          }
          style={{
            width: "100%",
            padding: "13px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            fontSize: "15px",
            background: "#fff",
            color: "#111",
          }}
        >
          <option value="All Time">
            All Time
          </option>

          <option value="Today">
            Today
          </option>

          <option value="Last 7 Days">
            Last 7 Days
          </option>

          <option value="Last 30 Days">
            Last 30 Days
          </option>

          <option value="Last 365 Days">
            Last 365 Days
          </option>

          <option value="Custom">
            Custom Date Range
          </option>
        </select>

        {timePeriod === "Custom" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  marginBottom: "5px",
                  color: "#666",
                }}
              >
                From
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                  background: "#fff",
                  color: "#111",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  marginBottom: "5px",
                  color: "#666",
                }}
              >
                To
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                  background: "#fff",
                  color: "#111",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
  <p>No Orders Yet.</p>
) : filteredOrders.length === 0 ? (
  <p
    style={{
      textAlign: "center",
      color: "#777",
      marginTop: "30px",
    }}
  >
    No orders found for the selected filters.
  </p>
) : (
      filteredOrders.map((order: any) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              background: "#fff",
            }}
          >
            <h3>Order #{order.id}</h3>

            <p>Date: {order.date}</p>

            <p>Items: {order.items.length}</p>

            <p>Total: ₹{order.total}</p>
            <hr
  style={{
    margin: "15px 0",
    border: "none",
    borderTop: "1px solid #eee",
  }}
/>
<hr
  style={{
    margin: "15px 0",
    border: "none",
    borderTop: "1px solid #eee",
  }}
/>

<h4>Customer Details</h4>

<p>
  <strong>Name:</strong>{" "}
  {order.customer?.name || "Not Available"}
</p>

<p>
  <strong>Mobile:</strong>{" "}
  {order.customer?.mobile || "Not Available"}
</p>

<p>
  <strong>Email:</strong>{" "}
  {order.customer?.email || "Not Available"}
</p>

<h4 style={{ marginTop: "15px" }}>
  Delivery Address
</h4>

{order.deliveryAddress ? (
  <>
    <p>{order.deliveryAddress.name}</p>

    <p>{order.deliveryAddress.mobile}</p>

    <p>{order.deliveryAddress.house}</p>

    <p>{order.deliveryAddress.area}</p>

    <p>
      {order.deliveryAddress.city},{" "}
      {order.deliveryAddress.state}
    </p>

    <p>{order.deliveryAddress.pincode}</p>
  </>
) : (
  <p>Address Not Available</p>
)}

<h4>Products</h4>

{order.items.map((item: any, index: number) => (
  <div
    key={index}
    style={{
      display: "flex",
      gap: "12px",
      marginBottom: "15px",
      paddingBottom: "12px",
      borderBottom: "1px solid #f2f2f2",
    }}
  >
    <img
      src={item.image}
      alt={item.name}
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "10px",
        objectFit: "cover",
      }}
    />

    <div style={{ flex: 1 }}>
      <strong>{item.name}</strong>

      <p style={{ margin: "4px 0", color: "#666" }}>
        Size: {item.size}
      </p>

      <p style={{ margin: "4px 0", color: "#666" }}>
        Qty: {item.quantity}
      </p>

      <p style={{ margin: "4px 0", fontWeight: "600" }}>
        ₹{item.price} × {item.quantity} = ₹
        {item.price * item.quantity}
      </p>
    </div>
  </div>
))}

            <p>
              <strong>Status:</strong> {order.status}
            </p>
            {order.status === "Cancelled" && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      background: "#fff7f7",
      border: "1px solid #f5b5b5",
      borderRadius: "10px",
    }}
  >
    <p>
      <strong>Reason:</strong>{" "}
      {order.cancelReason}
    </p>

    <p>
      <strong>Refund:</strong>{" "}
      {order.refundStatus}
    </p>
  </div>
)}

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order.id, e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
              }}
            >
              <option>Order Placed</option>
              <option>Confirmed</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            {cancelOrderId === order.id && (
  <div
    style={{
      marginTop: "15px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      background: "#fafafa",
    }}
  >
    <h4>Cancel Order</h4>

    <select
      value={cancelReason}
      onChange={(e) => setCancelReason(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginTop: "10px",
      }}
    >
      <option value="">Select Reason</option>
      <option value="Out of Stock">Out of Stock</option>
      <option value="Payment Issue">Payment Issue</option>
      <option value="Customer Requested">
        Customer Requested
      </option>
      <option value="Delivery Not Serviceable">
        Delivery Not Serviceable
      </option>
      <option value="Incorrect Price">
        Incorrect Price
      </option>
      <option value="Duplicate Order">
        Duplicate Order
      </option>
      <option value="Other">Other</option>
    </select>

    {cancelReason === "Other" && (
      <textarea
        placeholder="Enter cancellation reason..."
        value={otherReason}
        onChange={(e) =>
          setOtherReason(e.target.value)
        }
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "12px",
          minHeight: "80px",
        }}
      />
    )}

    <button
  onClick={() => {
    const finalReason =
      cancelReason === "Other"
        ? otherReason
        : cancelReason;

    if (!finalReason.trim()) {
      alert("Please select a cancellation reason.");
      return;
    }

    setOrders(
      orders.map((o: any) =>
        o.id === order.id
          ?{
  ...o,
  status: "Cancelled",

  cancelReason: finalReason,

  cancelMessage:
    finalReason === "Out of Stock"
      ? "We're sorry. Your ordered product is currently out of stock. If payment was made, your refund will be processed shortly."

      : finalReason === "Payment Issue"
      ? "Your order has been cancelled due to a payment issue. If any amount was deducted, it will be refunded shortly."

      : finalReason === "Customer Requested"
      ? "Your order has been cancelled as per your request."

      : finalReason === "Delivery Not Serviceable"
      ? "We're sorry. Delivery is not available at your location."

      : finalReason === "Incorrect Price"
      ? "Your order has been cancelled due to a pricing error. We sincerely apologize for the inconvenience."

      : finalReason === "Duplicate Order"
      ? "A duplicate order was detected, so this order has been cancelled."

      : finalReason,

  refundStatus: "Pending",
}
          : o
      )
    );

    setCancelOrderId(null);
    setCancelReason("");
    setOtherReason("");

    alert("Order cancelled successfully.");
  }}
  style={{
    width: "100%",
    marginTop: "15px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#d32f2f",
    color: "#fff",
    cursor: "pointer",
  }}
>
  Confirm Cancellation
</button>
  </div>
)}
          </div>
        ))
      )}
    </main>
  );
}