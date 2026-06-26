import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountSidebarNav from "@/components/account/AccountSidebarNav";

export const metadata = {
  title: "My Account | AVEX",
  description: "Manage your AVEX account",
};

export default async function AccountLayout({ children }) {
  const instance = await auth();
  const session = await instance.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 lg:gap-8 pt-4 md:pt-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 shrink-0 md:sticky md:top-28 self-start z-10">
        <AccountSidebarNav user={session.user} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 pb-8">
        {children}
      </div>
    </div>
  );
}
