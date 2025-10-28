import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-semibold">Dashboard</h1>
      <p className="text-zinc-600">Signed in as {session?.user?.email}</p>
    </div>
  );
}
