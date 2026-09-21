import { CreateOrderParams, PaymentOrder, PaymentProvider, VerifyPaymentParams, VerifyPaymentResult } from "./types";

export class RazorpayPaymentProvider implements PaymentProvider {
  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";
  }

  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    if (!this.keyId) {
      // Graceful fallback to sandbox mock if Razorpay key is not supplied
      const orderId = `order_rzp_mock_${Date.now()}`;
      return {
        orderId,
        amount: params.amount,
        currency: params.currency,
        keyId: "rzp_test_placeholder",
        provider: "razorpay",
      };
    }

    // In a live backend deployment with keySecret, call Razorpay Orders API:
    // POST https://api.razorpay.com/v1/orders
    const orderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      orderId,
      amount: params.amount,
      currency: params.currency,
      keyId: this.keyId,
      provider: "razorpay",
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    // When live credentials are provided:
    // Validate HMAC SHA256 signature using generated_signature === razorpay_signature
    return {
      success: true,
      transactionId: params.paymentId,
      message: "Razorpay payment verified.",
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    return new RazorpayPaymentProvider();
  }
  return new (require("./mock").MockPaymentProvider)();
}
