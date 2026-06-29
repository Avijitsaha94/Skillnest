"use client";
import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CourseCard, CourseCardSkeleton } from "@/components/explore/CourseCard";
import { useDebounce, useFilters } from "@/hooks";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/utils";
import api from "@/lib/api";
import type { ApiResponse, PaginatedResponse, Course } from "@/types";

function ExploreContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilters({
    category: searchParams.get("category") ?? "",
  });

  const debouncedSearch = useDebounce(search, 400);

  const queryParams = new URLSearchParams({
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.category && { category: filters.category }),
    ...(filters.level && { level: filters.level }),
    ...(filters.minPrice > 0 && { minPrice: String(filters.minPrice) }),
    ...(filters.maxPrice < 500 && { maxPrice: String(filters.maxPrice) }),
    ...(filters.rating > 0 && { rating: String(filters.rating) }),
    sort: filters.sort,
    page: String(page),
    limit: "12",
  });

  const { data, isLoading, isFetching } = useQuery<ApiResponse<PaginatedResponse<Course>>>({
    queryKey: ["courses", debouncedSearch, filters, page],
    queryFn: () => api.get(`/api/courses?${queryParams}`) as Promise<ApiResponse<PaginatedResponse<Course>>>,
    placeholderData: (prev) => prev,
  });

  const result = data?.data;
  const courses = result?.items ?? [];
  const totalPages = result?.pages ?? 1;

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleFilter = <K extends keyof typeof filters>(k: K, v: typeof filters[K]) => {
    updateFilter(k, v); setPage(1);
  };

  return (
    <div className="container-xl py-10" style={{ paddingTop: "84px" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">Explore Courses</h1>
        <p className="text-[var(--text-muted)]">
          {result?.total ? `${result.total} courses available` : "Find your next skill"}
        </p>
      </div>

      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search courses, topics, skills..."
            className="input-base pl-10"
            aria-label="Search courses"
          />
        </div>
        <select
          value={filters.sort}
          onChange={(e) => handleFilter("sort", e.target.value)}
          className="input-base sm:w-48"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
            hasActiveFilters || showFilters
              ? "bg-[var(--primary)] text-white border-[var(--primary)]"
              : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {hasActiveFilters && `(active)`}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-slide-up">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2 block">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilter("category", e.target.value)}
              className="input-base text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2 block">Level</label>
            <select
              value={filters.level}
              onChange={(e) => handleFilter("level", e.target.value)}
              className="input-base text-sm"
            >
              <option value="">All Levels</option>
              {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Min price */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2 block">
              Max Price: ${filters.maxPrice}
            </label>
            <input
              type="range" min={0} max={500} step={10}
              value={filters.maxPrice}
              onChange={(e) => handleFilter("maxPrice", Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>

          {/* Min rating */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2 block">
              Min Rating: {filters.rating > 0 ? `${filters.rating}★` : "Any"}
            </label>
            <div className="flex gap-1">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => handleFilter("rating", r)}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                    filters.rating === r
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={() => { resetFilters(); setPage(1); }}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium"
            >
              <X className="w-4 h-4" /> Reset All
            </button>
          </div>
        </div>
      )}

      {/* Results grid — 4 per row desktop */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${isFetching && !isLoading ? "opacity-70" : ""} transition-opacity`}>
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <CourseCardSkeleton key={i} />)
          : courses.length > 0
          ? courses.map((c) => <CourseCard key={c._id} course={c} />)
          : (
            <div className="col-span-full text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-[var(--text-muted)] text-lg">No courses found for your search.</p>
              <button onClick={() => { setSearch(""); resetFilters(); }} className="btn-primary mt-4">
                Clear filters
              </button>
            </div>
          )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === p
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}
