import type { Metadata } from "next";
import { ReserveForm } from "@/components/ember/ReserveForm";
import { SiteFooter } from "@/components/ember/SiteFooter";
import { SiteNavbar } from "@/components/ember/SiteNavbar";

export const metadata: Metadata = {
  title: "Reserve a table | Ember & Oak",
  description: "Choose a date, a seating and your party size to reserve a table at Ember & Oak.",
};

export default function ReservePage() {
  return (
    <>
      <SiteNavbar />
      <main>
        <ReserveForm />
      </main>
      <SiteFooter />
    </>
  );
}
