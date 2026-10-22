"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink, 
  IndianRupee, 
  Filter 
} from "lucide-react";
import { getAllPayments, updatePaymentStatus } from "@/lib/supabase/storage";
import { PaymentRecord } from "@/lib/types";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "rejected">("all");

  const loadPayments = () => {
    setPayments(getAllPayments());
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleStatusChange = (paymentId: string, newStatus: "completed" | "rejected" | "pending") => {
    updatePaymentStatus(paymentId, newStatus);
    loadPayments();
  };

  const filteredPayments = payments.filter((p) => {
    // Status filter
    if (statusFilter !== "all" && p.status !== statusFilter) {
      return false;
    }
    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.userEmail && p.userEmail.toLowerCase().includes(q)) ||
      (p.utrNumber && p.utrNumber.toLowerCase().includes(q)) ||
      (p.invitationTitle && p.invitationTitle.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q)
    );
  });

  const totalCollected = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">UPI Payments & Verifications</h1>
          <p className="text-xs text-stone-400 mt-1">
            Verify UTR transaction numbers and approve published invitation pages.
          </p>
        </div>

        {/* Revenue Tag */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl px-5 py-2.5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <IndianRupee className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Verified Revenue</span>
            <span className="text-lg font-bold font-serif text-emerald-400">
              ₹{totalCollected.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-900 p-4 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by email, UTR reference, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-stone-950 border border-stone-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-semibold w-full sm:w-auto overflow-x-auto">
          {(["all", "completed", "pending", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                statusFilter === status
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-xs">
            No payments match your current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Customer Email</th>
                  <th className="py-3 px-4">Invitation</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">UTR Number</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-stone-850/50 transition">
                    <td className="py-3.5 px-4 font-mono text-stone-400 text-[11px]">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {payment.userEmail}
                    </td>
                    <td className="py-3.5 px-4 text-stone-300">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[160px] font-medium">
                          {payment.invitationTitle || payment.invitationId}
                        </span>
                        {payment.invitationSlug && (
                          <Link
                            href={`/i/${payment.invitationSlug}`}
                            target="_blank"
                            className="text-amber-500 hover:text-amber-400"
                            title="View public invitation"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      ₹{payment.amount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-300">
                      <span className="bg-stone-950 px-2 py-1 rounded border border-stone-800">
                        {payment.utrNumber || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right space-x-2">
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
    </div>
  );
}
