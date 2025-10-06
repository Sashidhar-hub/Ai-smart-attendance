import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sha256Hex } from "@/lib/crypto";

const schema = z.object({
  token: z.string().min(16),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { token, email } = parsed.data;
  const tokenHash = sha256Hex(token);

  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
  if (!record || record.email !== email || record.expires < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { emailVerified: new Date() } }),
    prisma.emailVerificationToken.delete({ where: { tokenHash } }),
  ]);

  return NextResponse.json({ ok: true });
}
