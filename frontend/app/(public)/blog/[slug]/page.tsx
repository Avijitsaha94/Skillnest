import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch { return null; }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlog(params.slug);
  if (!post) notFound();

  return (
    <div style={{ paddingTop: "64px" }} className="py-12">
      <div className="container-xl max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="badge badge-primary">{tag}</span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] leading-tight mb-5">{post.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-8 pb-8 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Image
              src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name}`}
              alt={post.author?.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-medium text-[var(--text)]">{post.author?.name}</span>
          </div>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{formatNumber(post.views)} views</span>
        </div>

        {/* Thumbnail */}
        <div className="relative aspect-video rounded-[var(--radius)] overflow-hidden mb-10">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
        </div>

        {/* Content */}
        <div className="prose-custom text-[var(--text-secondary)] leading-relaxed space-y-4">
          {post.content.split("\n\n").map((para: string, i: number) => {
            if (para.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold text-[var(--text)] mt-8 mb-3">{para.slice(3)}</h2>;
            }
            if (para.startsWith("```")) {
              const code = para.replace(/```\w*\n?/, "").replace(/```$/, "");
              return (
                <pre key={i} className="bg-[var(--bg-tertiary)] p-4 rounded-lg overflow-x-auto text-sm font-mono text-[var(--text)] border border-[var(--border)]">
                  <code>{code}</code>
                </pre>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </div>

        {/* Author card */}
        <div className="card p-6 mt-12 flex items-start gap-4">
          <Image
            src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name}`}
            alt={post.author?.name}
            width={56}
            height={56}
            className="rounded-full flex-shrink-0"
          />
          <div>
            <p className="font-bold text-[var(--text)]">{post.author?.name}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Instructor & content creator at SkillNest.</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/blog" className="btn-secondary">← More Articles</Link>
        </div>
      </div>
    </div>
  );
}
