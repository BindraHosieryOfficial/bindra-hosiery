import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ========================================
// CREATE RAZORPAY ORDER
// ========================================

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    res.json(order);

  } catch (error) {
    console.error("Razorpay Order Error:", error);

    res.status(500).json({
      error: "Unable to create Razorpay order",
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
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
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
    `Razorpay server running on http://localhost:${PORT}`
  );
});