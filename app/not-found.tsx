import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">404</p>
      <h1 className="font-heading mt-3 text-6xl">This piece has left the rail</h1>
      <p className="mt-3 text-muted-foreground">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <Link href="/shop" className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
        Back to the shop
      </Link>
    </div>
  );
}
