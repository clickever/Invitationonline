"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Mail, Calendar, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import { getAllRegisteredUsers } from "@/lib/supabase/storage";
import { UserProfile } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setUsers(getAllRegisteredUsers());
  }, []);

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Registered Users</h1>
          <p className="text-xs text-stone-400 mt-1">
            Browse all user accounts registered on InviteStudio ({users.length} total)
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl bg-stone-900 border border-stone-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-xs">
            No registered users match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-850/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"}
                          alt={user.fullName}
                          className="h-9 w-9 rounded-full object-cover shrink-0"
                        />
                        <div className="font-semibold text-white truncate">{user.fullName}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-300">
                      {user.email}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500 text-[11px]">
                      {user.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-stone-400 text-[11px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
