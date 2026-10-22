"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  CreditCard, 
  IndianRupee, 
  Palette, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  PlusCircle, 
  Sparkles 
} from "lucide-react";
import { 
  getAllRegisteredUsers, 
  getAllPayments, 
  updatePaymentStatus, 
  getAdminSettings 
} from "@/lib/supabase/storage";
import { getAllTemplates } from "@/lib/templates";
import { PaymentRecord, UserProfile } from "@/lib/types";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [adminSettings, setAdminSettings] = useState({ upiId: "invitestudio@upi" });

  useEffect(() => {
    setUsers(getAllRegisteredUsers());
    setPayments(getAllPayments());
    setTemplatesCount(getAllTemplates().length);
    setAdminSettings(getAdminSettings());
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === "pending");

  const handleStatusChange = (paymentId: string, newStatus: "completed" | "rejected" | "pending") => {
    updatePaymentStatus(paymentId, newStatus);
    setPayments(getAllPayments());
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time activity for users, UPI payments, and custom invitation designs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/templates/new"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-500 transition active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Custom Design</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition"
          >
            <span>UPI: {adminSettings.upiId}</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Total Users</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-white">{users.length}</span>
            <span className="text-[11px] text-stone-500">accounts registered</span>
          </div>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
          >
            <span>View user roster</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Total Revenue</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-400">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <Link
            href="/admin/payments"
            className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline"
          >
            <span>{payments.filter(p => p.status === 'completed').length} completed orders</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Pending UPI Approvals</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-amber-400">{pendingPayments.length}</span>
            <span className="text-[11px] text-stone-500">awaiting review</span>
          </div>
          <Link
            href="/admin/payments"
            className="mt-4 inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
          >
            <span>Review payment UTRs</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Total Designs</span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Palette className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-white">{templatesCount}</span>
            <span className="text-[11px] text-stone-500">across 6 categories</span>
          </div>
          <Link
            href="/admin/templates"
            className="mt-4 inline-flex items-center gap-1 text-xs text-purple-400 hover:underline"
          >
            <span>Manage prices & tiers</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent UPI Payments Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-white">Recent UPI Payments</h2>
            <p className="text-xs text-stone-400">
              Track customer payments received to your UPI ID ({adminSettings.upiId})
            </p>
          </div>
          <Link
            href="/admin/payments"
            className="text-xs font-semibold text-amber-500 hover:text-amber-400"
          >
            View All ({payments.length})
          </Link>
        </div>

        {payments.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            No UPI payments recorded yet. Test publishing an invitation to generate a transaction.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">User Email</th>
                  <th className="pb-3 px-3">Invitation Title</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">UTR / Reference</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="hover:bg-stone-850/50">
                    <td className="py-3.5 px-3 text-stone-400 font-mono">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-white">
                      {payment.userEmail}
                    </td>
                    <td className="py-3.5 px-3 text-stone-300 max-w-[180px] truncate">
                      {payment.invitationTitle || payment.invitationId}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                      ₹{payment.amount}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-stone-400">
                      {payment.utrNumber || "N/A"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          payment.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : payment.status === "rejected"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {payment.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                        {payment.status === "rejected" && <XCircle className="h-3 w-3" />}
                        {payment.status === "pending" && <Clock className="h-3 w-3" />}
                        <span>{payment.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      {payment.status !== "completed" && (
                        <button
                          onClick={() => handleStatusChange(payment.id, "completed")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500 transition"
                        >
                          Approve
                        </button>
                      )}
                      {payment.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(payment.id, "rejected")}
                          className="px-2.5 py-1 rounded-lg bg-red-950 border border-red-800 text-red-300 font-bold text-[10px] hover:bg-red-900 transition"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registered Users Quick Preview */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-white">Registered Users</h2>
            <p className="text-xs text-stone-400">Users who have signed up on InviteStudio</p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-semibold text-amber-500 hover:text-amber-400"
          >
            Manage All ({users.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {users.slice(0, 6).map((u) => (
            <div
              key={u.id}
              className="bg-stone-950 border border-stone-800/80 rounded-2xl p-3.5 flex items-center gap-3"
            >
              <img
                src={u.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"}
                alt={u.fullName}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{u.fullName}</div>
                <div className="text-[11px] text-stone-400 truncate">{u.email}</div>
                <div className="text-[10px] text-amber-500 font-semibold mt-0.5">
                  Plan: {u.plan.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
