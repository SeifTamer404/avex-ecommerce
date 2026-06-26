import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import AddressManager from "@/components/account/AddressManager";

export const metadata = {
  title: "Saved Addresses | AVEX",
};

export default async function AddressesPage() {
  const instance = await auth();
  const session = await instance.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/login");

  await dbConnect();
  const user = await User.findById(session.user.id).select("addresses").lean();

  // Convert mongoose ObjectIds to strings to pass as props to client component safely
  const addresses = JSON.parse(JSON.stringify(user?.addresses || []));

  return (
    <AddressManager initialAddresses={addresses} userId={session.user.id} />
  );
}
