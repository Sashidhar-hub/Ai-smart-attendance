import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sha256Hex } from "@/lib/crypto";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(16),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { email, token, password } = parsed.data;

  const tokenHash = sha256Hex(token);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record || record.email !== email || record.expires < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { passwordHash } }),
    prisma.passwordResetToken.delete({ where: { tokenHash } }),
  ]);

  return NextResponse.json({ ok: true });
}
