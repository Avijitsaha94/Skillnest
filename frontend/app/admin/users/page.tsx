"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Search, Shield, UserCheck } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { ApiResponse, PaginatedResponse, User } from "@/types";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ApiResponse<PaginatedResponse<User> & { users: User[] }>>({
    queryKey: ["admin-users", page],
    queryFn: () => api.get(`/api/users?page=${page}&limit=15`) as Promise<ApiResponse<PaginatedResponse<User> & { users: User[] }>>,
  });

  const { mutate: changeRole } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.patch(`/api/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success("Role updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Failed to update role."),
  });

  const users = data?.data?.users ?? [];
  const totalPages = data?.data?.pages ?? 1;

  const filtered = search
    ? users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Users</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage platform users and roles.</p>
        </div>
        <div className="badge badge-primary">{data?.data?.total ?? 0} total</div>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-base pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {["User", "Email", "Role", "Enrolled", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-3 px-4">
                          <div className="skeleton h-4 w-24 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {u.avatar ? (
                            <Image src={u.avatar} alt={u.name} width={32} height={32} className="rounded-full flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-[var(--text)] whitespace-nowrap">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)] whitespace-nowrap">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`badge text-[10px] ${
                          u.role === "admin" ? "badge-primary" :
                          u.role === "manager" ? "badge-accent" : "badge-secondary"
                        }`}>{u.role}</span>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">
                        {u.enrolledCourses?.length ?? 0}
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)] whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole({ id: u._id, role: e.target.value })}
                          className="text-xs border border-[var(--border)] rounded-md px-2 py-1 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                        >
                          {["user", "manager", "admin"].map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-secondary)]"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-secondary)]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
