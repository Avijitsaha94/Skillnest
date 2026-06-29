import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users, BookOpen } from "lucide-react";
import { Course } from "@/types";
import { formatPrice, formatDuration, formatNumber, getLevelColor, truncate } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  showAIBadge?: boolean;
}

export function CourseCard({ course, showAIBadge }: CourseCardProps) {
  return (
    <div className="card flex flex-col h-full group">
      {/* Thumbnail — fixed aspect ratio */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-[var(--radius)] flex-shrink-0">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`badge text-[10px] ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          {showAIBadge && (
            <span className="badge badge-primary text-[10px]">✨ AI Pick</span>
          )}
        </div>
        <div className="absolute top-2 right-2 bg-[var(--accent)] text-white text-xs font-bold px-2 py-0.5 rounded-md">
          {formatPrice(course.price)}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-1.5">
          {course.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-[var(--text)] text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {course.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3 line-clamp-2 flex-1">
          {truncate(course.shortDescription, 100)}
        </p>

        {/* Instructor */}
        <p className="text-xs text-[var(--text-subtle)] mb-3">
          by <span className="text-[var(--text-secondary)] font-medium">
            {typeof course.instructor === "object" ? course.instructor.name : "Instructor"}
          </span>
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 star fill-current" />
            <span className="font-semibold text-[var(--text)]">{course.rating.toFixed(1)}</span>
            <span>({formatNumber(course.reviewCount)})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(course.duration)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {formatNumber(course.enrollments)}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/courses/${course._id}`}
          className="btn-primary w-full !justify-center !py-2 !text-sm mt-auto"
        >
          <BookOpen className="w-4 h-4" /> View Details
        </Link>
      </div>
    </div>
  );
}

/* ─── Skeleton loader ─────────────────────────────────── */
export function CourseCardSkeleton() {
  return (
    <div className="card flex flex-col h-full">
      <div className="skeleton w-full aspect-video rounded-t-[var(--radius)] rounded-b-none" />
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded mt-1" />
        <div className="skeleton h-8 w-full rounded mt-2" />
      </div>
    </div>
  );
}
