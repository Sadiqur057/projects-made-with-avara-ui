import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetails } from "@/components/custom/blocks/ProductDetailsBlock";
import { Crumbs } from "@/components/store/crumbs";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { categoryName, getProduct, products, relatedProducts } from "@/lib/store/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.blurb };
}

async function ProductContent({ params }: { params: PageProps<"/product/[slug]">["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product, 4);

  return (
    <>
      <Crumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: categoryName(product.category), href: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
      />
      <ProductDetails product={product} />

      <section aria-labelledby="related" className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6">
        <SectionHeading eyebrow="Complete the look" title={<span id="related">You may also like</span>} />
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[70vh] max-w-7xl px-4 py-12 sm:px-6" aria-busy="true" />}>
      <ProductContent params={props.params} />
    </Suspense>
  );
}
