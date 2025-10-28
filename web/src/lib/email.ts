import nodemailer from "nodemailer";

export async function sendMail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    // In dev, just log
    console.warn("Email not configured. Printing email:", params);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || user,
    ...params,
  });
}
