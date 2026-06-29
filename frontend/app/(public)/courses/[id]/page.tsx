import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, Clock, Users, BookOpen, CheckCircle,
  Play, Award, Globe, ChevronRight,
} from "lucide-react";
import { formatPrice, formatDuration, formatNumber, getLevelColor } from "@/lib/utils";
import { ReviewsSection } from "@/components/explore/ReviewsSection";

async function getCourse(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getRelated(category: string, currentId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses?category=${encodeURIComponent(category)}&limit=4`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return (data.data?.items ?? []).filter((c: { _id: string }) => c._id !== currentId).slice(0, 4);
  } catch { return []; }
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) notFound();

  const related = await getRelated(course.category, course._id);
  const instructor = typeof course.instructor === "object"
    ? course.instructor
    : { name: "Instructor", avatar: "" };

  return (
    <div style={{ paddingTop: "64px" }}>
      {/* Hero */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] py-12">
        <div className="container-xl">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
                <Link href="/explore" className="hover:text-[var(--primary)]">Courses</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/explore?category=${encodeURIComponent(course.category)}`} className="hover:text-[var(--primary)]">
                  {course.category}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[var(--text)] line-clamp-1">{course.title}</span>
              </nav>

              <span className={`badge mb-3 ${getLevelColor(course.level)}`}>{course.level}</span>
              <h1 className="text-3xl font-extrabold text-[var(--text)] mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-[var(--text-muted)] text-base mb-6">{course.shortDescription}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[var(--accent)] fill-current" />
                  <span className="font-bold text-[var(--text)]">{course.rating.toFixed(1)}</span>
                  <span className="text-[var(--text-muted)]">({formatNumber(course.reviewCount)} reviews)</span>
                </div>
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Users className="w-4 h-4" /> {formatNumber(course.enrollments)} students
                </span>
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {formatDuration(course.duration)}
                </span>
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Globe className="w-4 h-4" /> English
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Image
                  src={instructor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`}
                  alt={instructor.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="text-sm text-[var(--text-muted)]">
                  Created by{" "}
                  <span className="text-[var(--primary)] font-medium">{instructor.name}</span>
                </span>
              </div>
            </div>

            {/* Sticky enrollment card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-[var(--primary)] fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[var(--text)] mb-1">
                  {formatPrice(course.price)}
                </div>
                <Link
                  href="/dashboard/my-courses"
                  className="btn-primary w-full !justify-center !py-3 mb-3"
                >
                  Enroll Now
                </Link>
                <p className="text-xs text-[var(--text-muted)] text-center mb-4">
                  30-day money-back guarantee
                </p>
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  {[
                    { icon: Clock, text: `${formatDuration(course.duration)} of content` },
                    { icon: BookOpen, text: "Lifetime access" },
                    { icon: Award, text: "Certificate of completion" },
                    { icon: Globe, text: "Access on all devices" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[var(--primary)]" /> {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-xl py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Learning outcomes */}
            <section>
              <h2 className="text-xl font-bold text-[var(--text)] mb-5">What you will learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.outcomes?.map((o: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--text-secondary)]">{o}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-[var(--text)] mb-4">Course Description</h2>
              <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </section>

            {/* Tags */}
            {course.tags?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[var(--text)] mb-4">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/explore?search=${tag}`}
                      className="badge badge-primary hover:bg-[var(--primary)] hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Instructor */}
            <section>
              <h2 className="text-xl font-bold text-[var(--text)] mb-4">About the Instructor</h2>
              <div className="card p-5 flex gap-4">
                <Image
                  src={instructor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`}
                  alt={instructor.name}
                  width={64}
                  height={64}
                  className="rounded-full flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-[var(--text)]">{instructor.name}</h3>
                  {instructor.bio && (
                    <p className="text-sm text-[var(--text-muted)] mt-1">{instructor.bio}</p>
                  )}
                </div>
              </div>
            </section>

            {/* ✅ Reviews Section */}
            <ReviewsSection courseId={course._id} />
          </div>

          {/* Related courses sidebar */}
          {related.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[var(--text)] mb-5">Related Courses</h2>
              <div className="space-y-4">
                {related.map((r: { _id: string; thumbnail: string; title: string; price: number; rating: number }) => (
                  <Link key={r._id} href={`/courses/${r._id}`} className="flex gap-3 group">
                    <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={r.thumbnail} alt={r.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--primary)] line-clamp-2">
                        {r.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-[var(--accent)] fill-current" />
                        <span className="text-xs text-[var(--text-muted)]">{r.rating.toFixed(1)}</span>
                        <span className="text-xs font-semibold text-[var(--text)] ml-auto">
                          {formatPrice(r.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
