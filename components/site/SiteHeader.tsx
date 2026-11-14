import { SiteLink } from "@/components/site/SiteLink";
import { NavbarBlock } from "@/components/custom/blocks/NavbarBlock";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <NavbarBlock variant="glass" color="primary" logoText="Haven & Co." linkComponent={SiteLink} />
    </header>
  );
}
