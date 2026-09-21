"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  CreditCard, 
  User, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { getCurrentUser, setCurrentUser } from "@/lib/supabase/storage";
import { UserProfile } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
  }, []);

  const handleSignOut = () => {
    setCurrentUser(null);
    router.push("/");
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Invitations", href: "/dashboard/invitations", icon: Layers },
    { label: "Create Invitation", href: "/templates", icon: PlusCircle },
    { label: "Profile & Plan", href: "/dashboard/profile", icon: User },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EC] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-stone-900 font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-serif text-lg font-bold text-stone-900">
            Invite<span className="text-amber-700">Studio</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block fixed inset-0 z-40 bg-white" : "hidden md:flex"
        } w-full md:w-64 border-r border-stone-200 bg-white flex-col justify-between shrink-0 h-auto md:h-screen md:sticky md:top-0`}
      >
        <div className="p-6 space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-stone-900 shadow">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                Invite<span className="text-amber-700">Studio</span>
              </span>
            </Link>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 text-stone-400"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* User Profile Card */}
          <div className="rounded-2xl bg-amber-50/70 p-3.5 border border-amber-200/60 flex items-center gap-3">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"}
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-stone-900 truncate">
                {user?.fullName || "Sarah Jenkins"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  {user?.plan || "Free"} Plan
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-stone-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-stone-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Foot */}
        <div className="p-4 border-t border-stone-100 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-50"
          >
            <span>Visit Home Page</span>
            <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
