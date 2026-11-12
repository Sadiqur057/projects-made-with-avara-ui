"use client";

import Link from "next/link";
import { FashionHero } from "@/components/custom/blocks/FashionHeroBlock";
import { photo } from "@/lib/store/products";

const looks = [
  { src: photo("1515886657613-9f3515b0c78f", 800), alt: "Model in a yellow hoodie and joggers set", tone: "#f2c744", blend: false, position: "50% 20%" },
  { src: photo("1490481651871-ab68de25d43d", 900), alt: "A rail of white blouses and earthy knits", tone: "#e8dfd0", blend: false, position: "50% 40%" },
  { src: photo("1539109136881-3be0616acf4b", 900), alt: "Model in a powder-blue wool coat", tone: "#a9bfd9", blend: false, position: "50% 25%" },
  { src: photo("1572804013309-59a88b7e92f1", 900), alt: "Model in a red floral dress", tone: "#f3b447", blend: false, position: "50% 15%" },
  { src: photo("1566174053879-31528523f8ae", 900), alt: "Model in a plum off-shoulder gown", tone: "#8d7bd1", blend: false, position: "50% 20%" },
  { src: photo("1509631179647-0177331693ae", 900), alt: "Model in striped wide-leg trousers against a teal wall", tone: "#1f9d8a", blend: false, position: "50% 10%" },
  { src: photo("1556905055-8f358a7a47b2", 900), alt: "Flat-lay of a rust beanie, grey knit and jeans", tone: "#d9d0c4", blend: false, position: "50% 50%" },
];

export function HeroSection() {
  return (
    <FashionHero
      reveal="immediate"
      heading="Dress with intent. Wear it all season."
      looks={looks}
      avatarsHref="/shop"
      avatarsLabel="Shop the AW26 collection"
      cta={{ label: "Shop AW26", href: "/shop" }}
      quote={{
        text: "The coat is unreal in person. The drape, the weight, the colour. Everyone asks where it's from.",
        author: "Amara O.",
      }}
      teaser={{ index: "01", label: "Lookbook", title: "The Teal Hour: AW26 story", href: "/#lookbook" }}
      linkComponent={Link}
    />
  );
}
