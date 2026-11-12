import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-4 py-28 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-2 font-display text-5xl font-medium tracking-tight">We can&apos;t find that page</h1>
      <p className="mt-4 text-muted-foreground">
        It may have moved, or the product might be sold out. Let&apos;s get you back to something good.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="inline-flex h-12 items-center rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Shop all
        </Link>
        <Link href="/" className="inline-flex h-12 items-center rounded-xl border border-input px-7 text-sm font-semibold hover:bg-muted">
          Back home
        </Link>
      </div>
    </div>
  );
}
