import { useState } from "react";
import { useProduct } from "../context/ProductContext";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

type Period =
  | "today"
  | "7days"
  | "30days"
  | "365days"
  | "all"
  | "custom";

export default function AdminAnalytics() {
  const navigate = useNavigate();

  const { products } = useProduct();
  const { orders } = useOrder();

  const [period, setPeriod] =
    useState<Period>("all");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [appliedFromDate, setAppliedFromDate] =
    useState("");

  const [appliedToDate, setAppliedToDate] =
    useState("");

  const totalProducts = products.length;

  /*
    -----------------------------
    DATE RANGE
    -----------------------------
  */

  function getStartDate(
    days: number
  ) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    date.setDate(
      date.getDate() - (days - 1)
    );

    return date;
  }

  function getEndDate() {
    const date = new Date();

    date.setHours(
      23,
      59,
      59,
      999
    );

    return date;
  }

  function getOrderDate(
    order: any
  ) {
    if (!order.date) {
      return null;
    }

    const date = new Date(
      order.date
    );

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  function isOrderInSelectedPeriod(
    order: any
  ) {
    const orderDate =
      getOrderDate(order);

    /*
      If old order doesn't have
      a valid date, don't include
      it in date-based filters.
    */
    if (!orderDate) {
      return false;
    }

    if (period === "all") {
      return true;
    }

    if (period === "today") {
      const start =
        getStartDate(1);

      const end =
        getEndDate();

      return (
        orderDate >= start &&
        orderDate <= end
      );
    }

    if (period === "7days") {
      const start =
        getStartDate(7);

      const end =
        getEndDate();

      return (
        orderDate >= start &&
        orderDate <= end
      );
    }

    if (period === "30days") {
      const start =
        getStartDate(30);

      const end =
        getEndDate();

      return (
        orderDate >= start &&
        orderDate <= end
      );
    }

    if (period === "365days") {
      const start =
        getStartDate(365);

      const end =
        getEndDate();

      return (
        orderDate >= start &&
        orderDate <= end
      );
    }

    if (
      period === "custom"
    ) {
      if (
        !appliedFromDate ||
        !appliedToDate
      ) {
        return false;
      }

      const start =
        new Date(
          `${appliedFromDate}T00:00:00`
        );

      const end =
        new Date(
          `${appliedToDate}T23:59:59.999`
        );

      return (
        orderDate >= start &&
        orderDate <= end
      );
    }

    return true;
  }

  /*
    -----------------------------
    FILTERED ORDERS
    -----------------------------
  */

  const filteredOrders =
    orders.filter(
      isOrderInSelectedPeriod
    );

  /*
    -----------------------------
    ORDER ANALYTICS
    -----------------------------
  */

  const totalOrders =
    filteredOrders.length;

  const totalSales =
    filteredOrders.reduce(
      (
        sum: number,
        order: any
      ) =>
        sum +
        Number(
          order.total || 0
        ),
      0
    );

  const pendingOrders =
    filteredOrders.filter(
      (order: any) =>
        order.status !==
          "Delivered" &&
        order.status !==
          "Cancelled"
    ).length;

  const completedOrders =
    filteredOrders.filter(
      (order: any) =>
        order.status ===
        "Delivered"
    ).length;

  const cancelledOrders =
    filteredOrders.filter(
      (order: any) =>
        order.status ===
        "Cancelled"
    ).length;

  /*
    -----------------------------
    INVENTORY ANALYTICS
    These don't depend on dates.
    -----------------------------
  */

  const lowStockProducts =
    products.filter(
      (product: any) => {
        const sizes =
          product.sizes || [];

        const totalStock =
          sizes.reduce(
            (
              sum: number,
              size: any
            ) =>
              sum +
              Number(
                size.stock || 0
              ),
            0
          );

        return (
          totalStock > 0 &&
          totalStock <= 5
        );
      }
    ).length;

  const outOfStockProducts =
    products.filter(
      (product: any) => {
        const sizes =
          product.sizes || [];

        const totalStock =
          sizes.reduce(
            (
              sum: number,
              size: any
            ) =>
              sum +
              Number(
                size.stock || 0
              ),
            0
          );

        return totalStock === 0;
      }
    ).length;

  /*
    -----------------------------
    CUSTOM DATE APPLY
    -----------------------------
  */

  function handleApplyCustomDate() {
    if (
      !fromDate ||
      !toDate
    ) {
      alert(
        "Please select both From Date and To Date."
      );
      return;
    }

    if (
      fromDate > toDate
    ) {
      alert(
        "From Date cannot be after To Date."
      );
      return;
    }

    setAppliedFromDate(
      fromDate
    );

    setAppliedToDate(
      toDate
    );
  }

  /*
    -----------------------------
    PERIOD CHANGE
    -----------------------------
  */

  function handlePeriodChange(
    value: Period
  ) {
    setPeriod(value);

    if (value !== "custom") {
      setAppliedFromDate("");
      setAppliedToDate("");
    }
  }

  /*
    -----------------------------
    PERIOD LABEL
    -----------------------------
  */

  function getPeriodLabel() {
    if (period === "today") {
      return "Today";
    }

    if (period === "7days") {
      return "Last 7 Days";
    }

    if (period === "30days") {
      return "Last 30 Days";
    }

    if (period === "365days") {
      return "Last 365 Days";
    }

    if (period === "custom") {
      if (
        appliedFromDate &&
        appliedToDate
      ) {
        return `${appliedFromDate} → ${appliedToDate}`;
      }

      return "Custom Date Range";
    }

    return "All Time";
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1>Analytics</h1>

      <button
        onClick={() =>
          navigate("/admin")
        }
        style={{
          padding: "10px 16px",
          marginBottom: "25px",
          border: "none",
          borderRadius: "8px",
          background: "#eee",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      {/* -------------------------
          TIME PERIOD FILTER
      ------------------------- */}

      <div
        style={{
          background: "#fff",
          padding: "18px",
          borderRadius: "15px",
          marginBottom: "20px",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.06)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Sales & Orders Period
        </h3>

      <select
  value={period}
  onChange={(e) =>
    handlePeriodChange(
      e.target.value as Period
    )
  }
  style={{
    width: "100%",
    padding: "14px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "15px",
    background: "#fff",
    color: "#111",
    boxSizing: "border-box",
  }}
>
          <option value="today">
            Today
          </option>

          <option value="7days">
            Last 7 Days
          </option>

          <option value="30days">
            Last 30 Days
          </option>

          <option value="365days">
            Last 365 Days
          </option>

          <option value="all">
            All Time
          </option>

          <option value="custom">
            Custom Date Range
          </option>
        </select>

        {/* CUSTOM DATE RANGE */}

        {period === "custom" && (
          <div
            style={{
              marginTop: "18px",
            }}
          >
            <p
              style={{
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              From Date
            </p>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                border:
                  "1px solid #ccc",
                borderRadius: "10px",
                boxSizing:
                  "border-box",
              }}
            />

            <p
              style={{
                marginBottom: "6px",
                marginTop: "15px",
                fontWeight: "600",
              }}
            >
              To Date
            </p>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                border:
                  "1px solid #ccc",
                borderRadius: "10px",
                boxSizing:
                  "border-box",
              }}
            />

            <button
              onClick={
                handleApplyCustomDate
              }
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "15px",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Apply Date Range
            </button>
          </div>
        )}
      </div>

      {/* SELECTED PERIOD */}

      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "15px 18px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            opacity: 0.7,
          }}
        >
          Showing Analytics For
        </div>

        <strong
          style={{
            display: "block",
            marginTop: "4px",
            fontSize: "17px",
          }}
        >
          {getPeriodLabel()}
        </strong>
      </div>

      {/* -------------------------
          ANALYTICS CARDS
      ------------------------- */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "15px",
        }}
      >
        <AnalyticsCard
          title="Total Products"
          value={totalProducts}
          icon="📦"
        />

        <AnalyticsCard
          title="Orders"
          value={totalOrders}
          icon="🛒"
        />

        <AnalyticsCard
          title="Sales"
          value={`₹${totalSales}`}
          icon="💰"
        />

        <AnalyticsCard
          title="Pending Orders"
          value={pendingOrders}
          icon="⏳"
        />

        <AnalyticsCard
          title="Completed Orders"
          value={completedOrders}
          icon="✅"
        />

        <AnalyticsCard
          title="Cancelled Orders"
          value={cancelledOrders}
          icon="❌"
        />

        <AnalyticsCard
          title="Low Stock"
          value={lowStockProducts}
          icon="⚠️"
        />

        <AnalyticsCard
          title="Out of Stock"
          value={outOfStockProducts}
          icon="🚫"
        />
      </div>

      {/* -------------------------
          INVENTORY SUMMARY
      ------------------------- */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "25px",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.06)",
        }}
      >
        <h3>
          Inventory Summary
        </h3>

        <p>
          Total Products:{" "}
          <strong>
            {totalProducts}
          </strong>
        </p>

        <p>
          Low Stock Products:{" "}
          <strong>
            {lowStockProducts}
          </strong>
        </p>

        <p>
          Out of Stock Products:{" "}
          <strong>
            {outOfStockProducts}
          </strong>
        </p>
      </div>
    </main>
  );
}

function AnalyticsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "18px",
        borderRadius: "15px",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <p
        style={{
          margin: 0,
          color: "#777",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "8px 0 0",
        }}
      >
        {value}
      </h2>
    </div>
  );
}