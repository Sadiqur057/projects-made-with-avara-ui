"use client";

import { useState } from "react";
import { BookAppointment } from "@/components/custom/blocks/BookAppointmentBlock";
import { InputBlock } from "@/components/custom/blocks/InputBlock";
import { cn } from "@/lib/utils";
import { PHOTO, RESTAURANT, unsplash } from "@/lib/ember";

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

const SLOT_GROUPS = [
  {
    label: "Early seating",
    slots: [{ label: "5:30 PM" }, { label: "6:00 PM" }, { label: "6:30 PM", taken: true }, { label: "7:00 PM" }],
  },
  {
    label: "Late seating",
    slots: [{ label: "7:30 PM" }, { label: "8:00 PM", taken: true }, { label: "8:30 PM" }, { label: "9:00 PM" }],
  },
];

const RESTAURANT_PROFILE = {
  name: "Ember & Oak",
  shortName: "Ember & Oak",
  specialties: "Wood-fired fine dining · Dinner Tuesday to Sunday",
  practice: "118 Hearth Lane, Brooklyn",
  photo: unsplash(PHOTO.tasting, 900),
  photoAlt: "A plated course on a candlelit table at Ember & Oak",
  rating: 4.9,
  reviews: 1284,
  summary:
    "Guests call it warm, unhurried and quietly spectacular. The oak-fired wagyu and the tasting menu come up most, and tables fill up a week or two ahead on weekends.",
  location: RESTAURANT.address.join(", "),
  phone: RESTAURANT.phone,
  email: RESTAURANT.email,
  languages: "English, French, Spanish",
};

const SCORES = [
  { label: "Food", value: 4.93 },
  { label: "Service", value: 4.81 },
  { label: "Atmosphere", value: 4.88 },
];

const OCCASIONS = [
  { label: "Date night", value: 38 },
  { label: "Celebration", value: 27 },
  { label: "Tasting menu", value: 20 },
  { label: "Business dinner", value: 15 },
];

const KITCHEN_WEEK = [
  { label: "Hearth prep", value: 38 },
  { label: "Service", value: 34 },
  { label: "Sourcing", value: 16 },
  { label: "Pastry", value: 12 },
];

export function ReserveForm() {
  const [party, setParty] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Demo only: swap for a real call to your booking system.
  async function onBook({ day, slot }: { day: Date; slot: string }) {
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please add your name and a valid email so we can confirm your table.");
      throw new Error("Missing guest details");
    }
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.info("Reservation", { day, slot, party, name, email, notes });
  }

  const extras = (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold" id="party-label">
          Party size
        </p>
        <div role="radiogroup" aria-labelledby="party-label" className="mt-2 grid grid-cols-8 gap-1.5">
          {PARTY_SIZES.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={party === n}
              aria-label={`${n} ${n === 1 ? "guest" : "guests"}`}
              onClick={() => setParty(n)}
              className={cn(
                "h-10 rounded-lg border text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                party === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Larger party? Call us on {RESTAURANT.phone}.</p>
      </div>

      <InputBlock
        label="Name"
        placeholder="Your full name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputBlock
        type="email"
        label="Email"
        placeholder="you@email.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputBlock
        label="Allergies or occasion (optional)"
        placeholder="Anniversary, nut allergy…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <BookAppointment
      variant="solid"
      practitioner={RESTAURANT_PROFILE}
      scores={SCORES}
      visitReasons={OCCASIONS}
      activities={KITCHEN_WEEK}
      slotGroups={SLOT_GROUPS}
      unavailable={(d) => d.getDay() === 1}
      bookingHeading="Reserve your table"
      bookingExtras={extras}
      submitLabel="Reserve"
      onBook={onBook}
      className="min-h-[calc(100dvh-4rem)]"
    />
  );
}
