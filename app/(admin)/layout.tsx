import { requireAdmin } from "@/lib/auth/admin";
import { signOutAction } from "@/lib/auth/actions";
import { Logo } from "@/components/store/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-dvh bg-cream">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 bg-brand-900 p-5 lg:flex">
        <div className="rounded-xl bg-white/95 px-3 py-2">
          <Logo />
        </div>
        <AdminNav />
        <form action={signOutAction} className="border-t border-white/10 pt-4">
          <p className="mb-2 truncate px-1 text-xs text-brand-300">{user.email}</p>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-200 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4.5 w-4.5" /> Sign out
          </button>
        </form>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-brand-900 px-4 py-3 lg:hidden">
          <Logo mono />
          <span className="text-xs text-brand-200">Admin</span>
        </header>
        <main className="min-w-0 flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
