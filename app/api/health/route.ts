import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "taskpay",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    authConfigured: Boolean(process.env.AUTH_SECRET),
    timestamp: new Date().toISOString(),
  });
}
