import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateRandomToken, sha256Hex } from "@/lib/crypto";
import { sendMail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = generateRandomToken(32);
    const tokenHash = sha256Hex(token);
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30m
    await prisma.passwordResetToken.create({ data: { email, tokenHash, expires } });

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset?token=${token}&email=${encodeURIComponent(email)}`;
    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>` ,
    });
  }

  return NextResponse.json({ ok: true });
}
