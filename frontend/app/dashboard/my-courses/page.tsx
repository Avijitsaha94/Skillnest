"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { CourseCardSkeleton } from "@/components/explore/CourseCard";
import { formatDuration, formatNumber } from "@/lib/utils";
import type { ApiResponse, UserStats, Course } from "@/types";

export default function MyCoursesPage() {
  const { data, isLoading } = useQuery<ApiResponse<UserStats>>({
    queryKey: ["user-stats"],
    queryFn: () => api.get("/api/dashboard/user") as Promise<ApiResponse<UserStats>>,
  });

  const courses = (data?.data?.recentCourses ?? []) as Course[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">My Courses</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <Link href="/explore" className="btn-primary !py-2 !px-4 !text-sm">
          Browse More
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen className="w-16 h-16 text-[var(--text-subtle)] mx-auto mb-4" />
          <h2 className="font-bold text-[var(--text)] text-xl mb-2">No courses yet</h2>
          <p className="text-[var(--text-muted)] mb-6">
            Explore our catalog and enroll in your first course to start learning.
          </p>
          <Link href="/explore" className="btn-primary !px-8">
            Explore Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div key={c._id} className="card flex flex-col group">
              <div className="relative aspect-video rounded-t-[var(--radius)] overflow-hidden">
                <Image
                  src={c.thumbnail}
                  alt={c.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="w-full bg-white/30 rounded-full h-1.5">
                    <div
                      className="bg-[var(--secondary)] h-1.5 rounded-full"
                      style={{ width: "35%" }}
                    />
                  </div>
                  <p className="text-white text-xs mt-1">35% complete</p>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-4">
                <span className="text-xs font-semibold text-[var(--primary)] mb-1">{c.category}</span>
                <h3 className="font-bold text-[var(--text)] text-sm line-clamp-2 mb-3 group-hover:text-[var(--primary)] transition-colors">
                  {c.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4 mt-auto">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {formatDuration(c.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[var(--accent)] fill-current" />
                    {c.rating.toFixed(1)}
                  </span>
                </div>
                <Link
                  href={`/courses/${c._id}`}
                  className="btn-primary w-full !justify-center !py-2 !text-sm"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
