"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import api from "@/lib/api";
import { StarRating } from "@/components/ui/StarRating";
import { formatDate } from "@/lib/utils";
import type { ApiResponse, Review } from "@/types";

interface ReviewsProps {
  courseId: string;
}

interface ReviewsData {
  items: Review[];
  total: number;
  pages: number;
}

export function ReviewsSection({ courseId }: ReviewsProps) {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<ApiResponse<ReviewsData>>({
    queryKey: ["reviews", courseId, page],
    queryFn: () =>
      api.get(`/api/reviews/course/${courseId}?page=${page}&limit=5`) as Promise<
        ApiResponse<ReviewsData>
      >,
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: () =>
      api.post(`/api/reviews/course/${courseId}`, { rating, comment }),
    onSuccess: () => {
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", courseId] });
    },
    onError: (err: { error?: string }) => {
      toast.error(err?.error ?? "Failed to submit review.");
    },
  });

  const reviews = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.pages ?? 1;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
          Student Reviews
          <span className="text-sm font-normal text-[var(--text-muted)]">
            ({total})
          </span>
        </h2>
        {isSignedIn && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-secondary !py-2 !px-4 !text-sm"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && isSignedIn && (
        <div className="card p-6 mb-6 animate-slide-up">
          <h3 className="font-semibold text-[var(--text)] mb-4">Your Review</h3>
          <div className="mb-4">
            <p className="text-sm text-[var(--text-muted)] mb-2">Rating *</p>
            <StarRating
              rating={rating}
              interactive
              onChange={setRating}
              size="lg"
            />
          </div>
          <div className="mb-4">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
              Comment *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-base resize-none"
              placeholder="Share your experience with this course..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => submitReview()}
              disabled={rating === 0 || comment.trim().length < 10 || isPending}
              className="btn-primary !py-2 !px-6 disabled:opacity-50"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              ) : (
                "Submit Review"
              )}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 flex gap-4">
              <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-32 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="card p-10 text-center">
          <Star className="w-12 h-12 text-[var(--text-subtle)] mx-auto mb-3" />
          <p className="text-[var(--text-muted)]">
            No reviews yet. Be the first to review this course!
          </p>
          {isSignedIn && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary !py-2 !px-6 mt-4"
            >
              Write the first review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const reviewer =
              typeof review.user === "object" ? review.user : null;
            return (
              <div key={review._id} className="card p-5 flex gap-4">
                <div className="flex-shrink-0">
                  {reviewer?.avatar ? (
                    <Image
                      src={reviewer.avatar}
                      alt={reviewer.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold">
                      {(reviewer?.name ?? "U").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-[var(--text)]">
                      {reviewer?.name ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-secondary)]"
          >
            ← Prev
          </button>
          <span className="text-sm text-[var(--text-muted)]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-secondary)]"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
