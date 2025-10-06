declare module "nodemailer" {
  interface TransportOptions {
    host: string;
    port: number;
    secure?: boolean;
    auth?: { user: string; pass: string };
  }
  interface Transporter {
    sendMail(options: { from: string; to: string; subject: string; html: string }): Promise<void>;
  }
  const nodemailer: {
    createTransport(opts: TransportOptions): Transporter;
  };
  export default nodemailer;
}
