import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Tag } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

async function getBlogs(page = 1) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?page=${page}&limit=9`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return data.data ?? { items: [], total: 0, pages: 1 };
  } catch { return { items: [], total: 0, pages: 1 }; }
}

export default async function BlogPage() {
  const { items: posts } = await getBlogs();

  return (
    <div style={{ paddingTop: "64px" }}>
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="container-xl text-center">
          <span className="badge badge-primary mb-4">SkillNest Blog</span>
          <h1 className="section-title mb-3">Insights for modern developers</h1>
          <p className="section-subtitle mx-auto text-center">
            Career advice, technical deep-dives, and learning strategies from our instructors and community.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-xl">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)]">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: { _id: string; slug: string; thumbnail: string; tags: string[]; title: string; excerpt: string; author: { name: string; avatar: string }; createdAt: string; views: number }) => (
                <article key={post._id} className="card flex flex-col group h-full">
                  <div className="relative aspect-video rounded-t-[var(--radius)] overflow-hidden flex-shrink-0">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="badge badge-primary text-[10px]">{tag}</span>
                      ))}
                    </div>
                    <h2 className="font-bold text-[var(--text)] leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-[var(--text-subtle)] mt-auto pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1.5">
                        <Image
                          src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name}`}
                          alt={post.author?.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span>{post.author?.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.createdAt)}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(post.views)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
