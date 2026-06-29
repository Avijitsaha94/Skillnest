"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Trash2, Eye } from "lucide-react";
import api from "@/lib/api";
import { formatPrice, formatNumber, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { ApiResponse, Course } from "@/types";

interface AdminCoursesResponse {
  items: Course[];
  total: number;
  pages: number;
  page: number;
}

export default function AdminCoursesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ApiResponse<AdminCoursesResponse>>({
    queryKey: ["admin-courses", page],
    queryFn: () =>
      api.get(`/api/dashboard/admin/courses?page=${page}&limit=10`) as Promise<ApiResponse<AdminCoursesResponse>>,
  });

  const { mutate: deleteCourse } = useMutation({
    mutationFn: (id: string) => api.delete(`/api/courses/${id}`),
    onSuccess: () => {
      toast.success("Course deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: () => toast.error("Failed to delete course."),
  });

  const courses = data?.data?.items ?? [];
  const totalPages = data?.data?.pages ?? 1;

  const filtered = search
    ? courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : courses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Courses</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage all platform courses.</p>
        </div>
        <div className="badge badge-primary">{data?.data?.total ?? 0} total</div>
      </div>

      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="input-base pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {["Course", "Category", "Price", "Rating", "Enrollments", "Status", "Actions"].map((h) => (
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
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="py-3 px-4"><div className="skeleton h-4 w-20 rounded" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.map((c) => (
                    <tr key={c._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-8 rounded overflow-hidden flex-shrink-0">
                            <Image src={c.thumbnail} alt={c.title} fill className="object-cover" />
                          </div>
                          <span className="font-medium text-[var(--text)] line-clamp-2 max-w-[200px]">{c.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)] whitespace-nowrap">{c.category}</td>
                      <td className="py-3 px-4 font-semibold text-[var(--text)]">{formatPrice(c.price)}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-[var(--accent)]">
                          ★ {c.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">{formatNumber(c.enrollments)}</td>
                      <td className="py-3 px-4">
                        <span className={`badge text-[10px] ${c.isPublished ? "badge-secondary" : "bg-gray-100 text-gray-600"}`}>
                          {c.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/courses/${c._id}`}
                            className="w-7 h-7 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm("Delete this course?")) deleteCourse(c._id);
                            }}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-secondary)]">
                Previous
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-secondary)]">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
