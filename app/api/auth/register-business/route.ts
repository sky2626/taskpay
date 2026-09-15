import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
  companyName: z.string().trim().min(2).max(120),
  registrationNo: z.string().trim().max(80).optional().or(z.literal("")),
  countryCode: z.string().trim().min(2).max(3).default("GH"),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your business registration details." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      role: "BUSINESS",
      status: "PENDING",
      businessProfile: {
        create: {
          companyName: parsed.data.companyName,
          registrationNo: parsed.data.registrationNo || null,
          countryCode: parsed.data.countryCode.toUpperCase(),
        },
      },
    },
    select: { id: true, email: true, name: true, role: true, status: true },
  });

  await createSession(user.id);
  return NextResponse.json({ user }, { status: 201 });
}
