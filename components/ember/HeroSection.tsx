"use client";

import Link from "next/link";
import { HeroCarousel } from "@/components/custom/blocks/HeroCarouselBlock";
import { FACES, PHOTO, unsplash } from "@/lib/ember";

const SLIDES = [
  {
    image: unsplash(PHOTO.tasting, 1800),
    alt: "A plated course set on a candlelit table",
    title: "The oak-ember tasting menu",
    description: "Seven courses cooked over live oak and cherrywood, one plate at a time.",
    heading: (
      <>
        Where fire meets
        <br />
        fine dining
      </>
    ),
  },
  {
    image: unsplash(PHOTO.diningRoom, 1800),
    alt: "The Ember & Oak dining room with set tables and warm lighting",
    title: "The dining room",
    description: "Candlelit tables, an open hearth and room for forty-eight guests.",
    heading: (
      <>
        An evening worth
        <br />
        dressing for
      </>
    ),
  },
  {
    image: unsplash(PHOTO.cocktail, 1800),
    alt: "A smoked old fashioned being poured over a large ice sphere",
    title: "Smoked cocktails & cellar",
    description: "An oak-barrel bar programme beside a cellar of 420 labels.",
    heading: (
      <>
        Pour something
        <br />
        unforgettable
      </>
    ),
  },
  {
    image: unsplash(PHOTO.dessert, 1800),
    alt: "A raspberry mille-feuille on a dark plate",
    title: "Pastry, made every morning",
    description: "Finish with caramelised layers, oak-smoked cream and fresh raspberries.",
    heading: (
      <>
        Finish with
        <br />
        something sweet
      </>
    ),
  },
];

export function HeroSection() {
  return (
    <HeroCarousel
      className="lg:h-[calc(100svh-4rem)]"
      eyebrow="Wood-fired fine dining · Brooklyn"
      heading={
        <>
          Where fire meets
          <br />
          fine dining
        </>
      }
      slides={SLIDES}
      intro="Seasonal tasting menus cooked over live oak, served in a candlelit room. Tuesday to Sunday, from 5:30 pm."
      avatars={FACES.map((src, i) => ({ src, alt: `Guest ${i + 1}` }))}
      avatarsLabel="12,000+ guests this year"
      cta={{ label: "Reserve a table", href: "/reserve" }}
      linkComponent={Link}
      interval={6000}
      reveal="immediate"
    />
  );
}
