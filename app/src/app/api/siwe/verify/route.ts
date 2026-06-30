import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json();
    const session = await getSession();

    if (!session.nonce) {
      return NextResponse.json({ error: "Missing nonce" }, { status: 422 });
    }

    const siwe = new SiweMessage(message);
    const fields = await siwe.verify({
      signature,
      nonce: session.nonce,
    });

    session.address = fields.data.address;
    session.chainId = fields.data.chainId;
    session.isLoggedIn = true;
    session.nonce = undefined;
    await session.save();

    return NextResponse.json({
      ok: true,
      address: fields.data.address,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
}
