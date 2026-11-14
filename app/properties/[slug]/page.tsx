import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductDetails } from "@/components/custom/blocks/ProductDetailsBlock";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PropertyCard } from "@/components/site/PropertyCard";
import { PROPERTIES, getProperty, money } from "@/lib/properties";

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const property = getProperty(slug);
  return { title: property ? `${property.title} — Haven & Co. Realty` : "Property not found" };
}

type Params = PageProps<"/properties/[slug]">["params"];

export default function PropertyPage(props: PageProps<"/properties/[slug]">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
          <PropertyContent params={props.params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function PropertyContent({ params }: { params: Params }) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const similar = PROPERTIES.filter((p) => p.slug !== property.slug).slice(0, 3);

  return (
    <>
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-8 text-sm text-muted-foreground sm:px-6">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">Home</Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li>
              <Link href="/#listings" className="hover:text-foreground">Listings</Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li aria-current="page" className="font-medium text-foreground">{property.title}</li>
          </ol>
        </nav>

        <ProductDetails
          variant="modern-split-gallery"
          className="!pt-6"
          title={property.title}
          address={`${property.address}, ${property.city}`}
          price={money(property.price)}
          originalPrice={property.originalPrice ? money(property.originalPrice) : ""}
          description={property.description}
          badge={property.badge}
          rating={4.8}
          reviewsCount={126}
          images={property.images}
          facts={[
            { label: "Bedrooms", value: String(property.beds) },
            { label: "Bathrooms", value: String(property.baths) },
            { label: "Living area", value: `${property.sqft.toLocaleString("en-US")} sqft` },
            { label: "Property type", value: property.type },
          ]}
          specs={[
            { label: "Year built", value: String(property.built) },
            { label: "Lot size", value: property.lot },
            { label: "Parking", value: property.parking },
            { label: "Price per sqft", value: `$${Math.round(property.price / property.sqft).toLocaleString("en-US")}` },
          ]}
          amenities={property.amenities}
          neighborhood={property.neighborhood}
          ctaHref="/schedule"
        />

        <section className="bg-secondary/60 px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">You might also like</h2>
            <ul className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <li key={p.slug} className="flex">
                  <div className="flex w-full">
                    <PropertyCard property={p} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
    </>
  );
}
