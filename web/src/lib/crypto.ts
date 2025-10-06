import crypto from "crypto";

export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
