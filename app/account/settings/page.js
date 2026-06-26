import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SettingsManager from "@/components/account/SettingsManager";

export const metadata = {
  title: "Settings | AVEX",
};

export default async function SettingsPage() {
  const instance = await auth();
  const session = await instance.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/login");

  await dbConnect();
  const user = await User.findById(session.user.id).lean();

  if (!user) redirect("/login");

  // Pass necessary fields cleanly serialized to client component
  const initialUser = {
    name: user.name || "",
    email: user.email || "",
    avatar: user.avatar || "",
    emailOrderUpdates: user.emailOrderUpdates ?? true,
    emailPromotions: user.emailPromotions ?? false,
    emailNewArrivals: user.emailNewArrivals ?? false,
  };

  return (
    <SettingsManager initialUser={initialUser} userId={session.user.id} />
  );
}
