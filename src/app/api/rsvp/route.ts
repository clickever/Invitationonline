import { NextResponse } from "next/server";
import { submitRsvp, getRsvpsForInvitation } from "@/lib/supabase/storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("invitationId");
    if (!invitationId) {
      return NextResponse.json({ error: "Missing invitationId parameter" }, { status: 400 });
    }
    const rsvps = await getRsvpsForInvitation(invitationId);
    return NextResponse.json({ success: true, rsvps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.invitationId || !body.guestName) {
      return NextResponse.json({ error: "Missing required RSVP fields" }, { status: 400 });
    }
    const rsvp = await submitRsvp(body);
    return NextResponse.json({ success: true, rsvp });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
