import { CreateOrderParams, PaymentOrder, PaymentProvider, VerifyPaymentParams, VerifyPaymentResult } from "./types";

export class MockPaymentProvider implements PaymentProvider {
  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    const orderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      orderId,
      amount: params.amount,
      currency: params.currency,
      provider: "mock",
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    return {
      success: true,
      transactionId: params.paymentId || `pay_mock_${Date.now()}`,
      message: "Payment successfully verified via sandbox environment.",
    };
  }
}
