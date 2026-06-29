"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { ApiResponse, Review } from "@/types";

interface AdminReviewsResponse { items: Review[]; total: number; pages: number; }

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ApiResponse<AdminReviewsResponse>>({
    queryKey: ["admin-reviews", page],
    queryFn: () => api.get(`/api/reviews/admin/all?page=${page}`) as Promise<ApiResponse<AdminReviewsResponse>>,
  });

  const { mutate: deleteReview } = useMutation({
    mutationFn: (id: string) => api.delete(`/api/reviews/${id}`),
    onSuccess: () => { toast.success("Review deleted."); queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }); },
    onError: () => toast.error("Failed to delete."),
  });

  const reviews = data?.data?.items ?? [];
  const totalPages = data?.data?.pages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Reviews</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Moderate all course reviews.</p>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {["User", "Course", "Rating", "Comment", "Date", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="py-3 px-4"><div className="skeleton h-4 w-20 rounded" /></td>)}</tr>
                  ))
                : reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-[var(--bg-secondary)]">
                      <td className="py-3 px-4 font-medium text-[var(--text)] whitespace-nowrap">
                        {typeof r.user === "object" ? r.user.name : "—"}
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)] max-w-[150px] truncate">
                        {typeof r.course === "object" ? (r.course as unknown as { title: string }).title : r.course}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[var(--accent)]">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)] max-w-[250px] truncate">{r.comment}</td>
                      <td className="py-3 px-4 text-[var(--text-muted)] whitespace-nowrap">{formatDate(r.createdAt)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => { if (confirm("Delete this review?")) deleteReview(r._id); }}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] disabled:opacity-40">Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
