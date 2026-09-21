import { NextResponse } from "next/server";
import { MockPaymentProvider } from "@/lib/payments/mock";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    const provider = new MockPaymentProvider();

    if (action === "create_order") {
      const order = await provider.createOrder(params);
      return NextResponse.json({ success: true, order });
    }

    if (action === "verify_payment") {
      const result = await provider.verifyPayment(params);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: "Invalid payment action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
