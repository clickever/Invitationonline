import { NextResponse } from "next/server";
import { getAllUserInvitations, saveInvitation } from "@/lib/supabase/storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;
    const items = await getAllUserInvitations(userId);
    return NextResponse.json({ success: true, invitations: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const saved = await saveInvitation(body);
    return NextResponse.json({ success: true, invitation: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
