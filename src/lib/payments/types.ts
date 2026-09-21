export interface CreateOrderParams {
  invitationId?: string;
  planId: "single_invite" | "pro_pass";
  amount: number;
  currency: string;
  userEmail: string;
  userName: string;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId?: string;
  provider: "razorpay" | "mock";
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature?: string;
  invitationId?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  transactionId: string;
  message?: string;
}

export interface PaymentProvider {
  createOrder(params: CreateOrderParams): Promise<PaymentOrder>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
}
