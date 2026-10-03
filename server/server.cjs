const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// RAZORPAY CREDENTIAL DIAGNOSTIC
// ========================================

const razorpayKeyId = (process.env.RAZORPAY_KEY_ID || "").trim();
const razorpayKeySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

console.log("Razorpay credential check:", {
  keyIdPresent: Boolean(razorpayKeyId),
  keyIdMode: razorpayKeyId.startsWith("rzp_live_")
    ? "LIVE"
    : razorpayKeyId.startsWith("rzp_test_")
    ? "TEST"
    : "UNKNOWN",
  keyIdLast4: razorpayKeyId.slice(-4),
  secretPresent: Boolean(razorpayKeySecret),
  secretLength: razorpayKeySecret.length,
});


// ========================================
// RAZORPAY INSTANCE
// ========================================

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});


app.get("/", (req, res) => {
  res.json({
    message: "Bindra Hosiery payment server is running",
  });
});


// ========================================
// CREATE RAZORPAY ORDER
// ========================================

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `bindra_hosiery_${Date.now()}`,
    });

    console.log("Razorpay order created:", {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });

    res.json(order);

  } catch (error) {
    console.error("Razorpay Order Error:", {
      statusCode: error.statusCode,
      error: error.error,
    });

    res.status(500).json({
      message: "Unable to create Razorpay order",
    });
  }
});


// ========================================
// VERIFY RAZORPAY PAYMENT
// ========================================

app.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest("hex");

    const isValid =
      generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    console.log("Payment verified successfully.");

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error(
      "Payment Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Payment verification error",
    });
  }
});


// ========================================
// START SERVER
// ========================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Bindra Hosiery payment server running on http://localhost:${PORT}`
  );
});