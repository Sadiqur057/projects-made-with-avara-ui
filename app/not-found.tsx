import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 pt-32 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">This road leads nowhere</h1>
      <p className="mt-4 text-muted-foreground">The page you are looking for has moved or never existed. Let us get you back on route.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6")}>Back home</Link>
        <Link href="/packages" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-6")}>Browse packages</Link>
      </div>
    </div>
  );
}
