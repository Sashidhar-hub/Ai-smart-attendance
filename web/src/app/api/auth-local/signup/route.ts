import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateRandomToken, sha256Hex } from "@/lib/crypto";
import { sendMail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  // Email verification
  const token = generateRandomToken(32);
  const tokenHash = sha256Hex(token);
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.emailVerificationToken.create({ data: { email, tokenHash, expires } });

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}`;

  await sendMail({
    to: email,
    subject: "Verify your email",
    html: `<p>Welcome! Click to verify your email:</p><p><a href="${verifyUrl}">Verify Email</a></p>` ,
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
