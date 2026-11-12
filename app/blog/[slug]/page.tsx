import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { BLOG, PACKAGES, getPackage, getPost } from "@/lib/travel-data";

const RELATED: Record<string, string> = {
  "when-to-visit-japan": "kyoto-cherry-blossom-journey",
  "pack-light-two-weeks": "swiss-alps-explorer",
  "safari-first-timers": "tanzania-serengeti-safari",
  "greek-islands-shoulder-season": "santorini-sunset-escape",
  "a-night-in-the-sahara": "morocco-medina-and-desert",
  "travel-insurance-explained": "paris-romance-weekender",
};
import { PackageCard } from "@/components/site/package-card";

export function generateStaticParams() {
  return BLOG.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

const fmt = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = BLOG.findIndex((p) => p.slug === post.slug);
  const next = BLOG[(index + 1) % BLOG.length];
  const suggestion = getPackage(RELATED[post.slug] ?? "") ?? PACKAGES[0];

  return (
    <article>
      <div className="mx-auto w-full max-w-3xl px-5 pb-8 pt-32 sm:px-8 sm:pt-36">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Travel journal
        </Link>
        <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-accent-foreground">{post.category}</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {post.readMinutes} min read</span>
        </div>
        <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        <p className="mt-6 text-sm text-muted-foreground">By <span className="font-medium text-foreground">{post.author}</span> · {fmt.format(new Date(post.date))}</p>
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt="" className="aspect-[16/8] w-full rounded-3xl object-cover" />
      </div>

      <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8">
        <div className="grid gap-6 text-lg leading-relaxed">
          {post.body.map((para, i) => (
            <p key={i} className={i === 0 ? "text-xl text-foreground first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.9] first-letter:text-primary" : "text-foreground/85"}>
              {para}
            </p>
          ))}
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8" aria-label="Keep reading">
        <div className="grid gap-8 border-t border-border pt-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-primary">Up next</p>
            <Link href={`/blog/${next.slug}`} className="group block rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <h2 className="text-2xl font-semibold">{next.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{next.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">Read next <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-primary">Ready to go?</p>
            <PackageCard pkg={suggestion} />
          </div>
        </div>
      </section>
    </article>
  );
}
