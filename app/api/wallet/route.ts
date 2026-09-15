import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getWalletBalance } from "@/lib/wallet/balance";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const balance = await getWalletBalance(session.userId);

  return NextResponse.json({
    currency: balance.currency,
    availableMinor: balance.availableMinor.toString(),
    pendingMinor: balance.pendingMinor.toString(),
    reservedMinor: balance.reservedMinor.toString(),
    lifetimeEarnedMinor: balance.lifetimeEarnedMinor.toString(),
    withdrawnMinor: balance.withdrawnMinor.toString(),
  });
}
