import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.address) {
    return NextResponse.json({ isLoggedIn: false });
  }
  return NextResponse.json({
    isLoggedIn: true,
    address: session.address,
    chainId: session.chainId,
  });
}
