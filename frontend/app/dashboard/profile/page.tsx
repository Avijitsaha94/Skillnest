"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { User, Mail, Globe, FileText, Save, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, User as IUser } from "@/types";
import { getInitials } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  bio: z.string().max(500, "Bio max 500 characters").optional(),
  website: z.union([z.string().url("Enter a valid URL"), z.literal("")]).optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ApiResponse<IUser>>({
    queryKey: ["profile"],
    queryFn: () => api.get("/api/users/me") as Promise<ApiResponse<IUser>>,
  });

  const dbUser = data?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      name: dbUser?.name ?? clerkUser?.fullName ?? "",
      bio: dbUser?.bio ?? "",
      website: dbUser?.website ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => api.patch("/api/users/me", data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error("Failed to update profile."),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  const avatar = clerkUser?.imageUrl;
  const initials = getInitials(dbUser?.name ?? "User");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">My Profile</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Update your personal information and public profile.
        </p>
      </div>

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-5">
        {avatar ? (
          <Image
            src={avatar}
            alt={dbUser?.name ?? "User"}
            width={80}
            height={80}
            className="rounded-full border-4 border-[var(--primary-light)]"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        )}
        <div>
          <p className="font-bold text-[var(--text)] text-lg">{dbUser?.name}</p>
          <p className="text-sm text-[var(--text-muted)]">{dbUser?.email}</p>
          <span className={`badge mt-2 ${
            dbUser?.role === "admin"
              ? "badge-primary"
              : dbUser?.role === "manager"
              ? "badge-accent"
              : "badge-secondary"
          }`}>
            {dbUser?.role ?? "user"}
          </span>
        </div>
        <p className="ml-auto text-xs text-[var(--text-subtle)]">
          Avatar managed via Clerk settings
        </p>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit((d) => mutate(d))} className="card p-6 space-y-5">
        <h2 className="font-bold text-[var(--text)] flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--primary)]" /> Personal Information
        </h2>

        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            Full Name *
          </label>
          <input
            {...register("name")}
            className="input-base"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
            <input
              value={dbUser?.email ?? ""}
              disabled
              className="input-base pl-10 opacity-60 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-[var(--text-subtle)] mt-1">Email is managed through your Clerk account.</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            Bio
          </label>
          <textarea
            {...register("bio")}
            rows={3}
            className="input-base resize-none"
            placeholder="Tell us a bit about yourself and your learning goals..."
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            Website / Portfolio
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
            <input
              {...register("website")}
              className="input-base pl-10"
              placeholder="https://yourwebsite.com"
            />
          </div>
          {errors.website && (
            <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
          <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-xl font-extrabold text-[var(--primary)]">
              {dbUser?.enrolledCourses?.length ?? 0}
            </div>
            <div className="text-xs text-[var(--text-muted)]">Enrolled Courses</div>
          </div>
          <div className="text-center p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-xl font-extrabold text-[var(--secondary)]">
              {dbUser?.completedCourses?.length ?? 0}
            </div>
            <div className="text-xs text-[var(--text-muted)]">Completed</div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="btn-primary w-full !justify-center !py-3 disabled:opacity-50"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </form>
    </div>
  );
}
