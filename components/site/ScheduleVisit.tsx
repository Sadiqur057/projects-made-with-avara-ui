"use client";

import { BookAppointment } from "@/components/custom/blocks/BookAppointmentBlock";
import { img } from "@/lib/properties";

const AGENT = {
  name: "Amelia Hart, Senior Agent",
  shortName: "Amelia",
  specialties: "Residential sales · Relocation · First-time buyers",
  practice: "Haven & Co. Realty, 210 Congress Ave",
  photo: img("1438761681033-6461ffad8d80", 900),
  photoAlt: "Portrait of Amelia Hart, senior agent at Haven & Co.",
  rating: 4.9,
  reviews: 212,
  summary:
    "Clients describe Amelia as calm, candid and always reachable. She is known for spotting problems in a home before the inspection does.",
  location: "210 Congress Ave, Austin, TX",
  phone: "(555) 014-2200",
  email: "amelia@havenandco.example",
  languages: "English, Spanish",
};

const SCORES = [
  { label: "Responsiveness", value: 4.92 },
  { label: "Local knowledge", value: 4.87 },
  { label: "Negotiation", value: 4.78 },
];

const REQUESTS = [
  { label: "Family homes", value: 38 },
  { label: "Apartments & lofts", value: 27 },
  { label: "Relocation help", value: 21 },
  { label: "Investment property", value: 14 },
];

const WEEK = [
  { label: "Tours", value: 42 },
  { label: "Negotiating", value: 22 },
  { label: "Paperwork", value: 16 },
  { label: "Client calls", value: 14 },
  { label: "Other", value: 6 },
];

const SLOT_GROUPS = [
  {
    label: "Morning",
    slots: [{ label: "9:00 AM" }, { label: "10:00 AM" }, { label: "11:00 AM", taken: true }],
  },
  {
    label: "Afternoon",
    slots: [{ label: "1:00 PM" }, { label: "2:00 PM" }, { label: "3:00 PM", taken: true }, { label: "4:30 PM" }],
  },
];

export function ScheduleVisit() {
  return (
    <BookAppointment
      variant="solid"
      practitioner={AGENT}
      scores={SCORES}
      visitReasons={REQUESTS}
      activities={WEEK}
      slotGroups={SLOT_GROUPS}
      bookingHeading="Schedule a visit"
      unavailable={(d) => d.getDay() === 0}
      onBook={async () => {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }}
      className="min-h-0"
    />
  );
}

