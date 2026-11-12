import { dealPrice, type TravelPackage } from "./travel-data";

export const CHILD_RATE = 0.7; // children (2–11) pay 70%
export const INSURANCE_PER_PERSON = 49;
export const TRANSFER_PER_PERSON = 30;
export const DEPOSIT_RATE = 0.25;
export const MAX_TRAVELLERS = 12;

export interface QuoteInput {
  pkg: TravelPackage;
  adults: number;
  children: number;
  /** Apply the last-minute discount. */
  deal?: boolean;
  insurance?: boolean;
  transfer?: boolean;
}

export function quote({ pkg, adults, children, deal, insurance, transfer }: QuoteInput) {
  const unit = deal && pkg.deal ? dealPrice(pkg) : pkg.price;
  const adultsTotal = unit * adults;
  const childrenTotal = Math.round(unit * CHILD_RATE) * children;
  const people = adults + children;
  const insuranceTotal = insurance ? INSURANCE_PER_PERSON * people : 0;
  const transferTotal = transfer ? TRANSFER_PER_PERSON * people : 0;
  const total = adultsTotal + childrenTotal + insuranceTotal + transferTotal;
  const saved = deal && pkg.deal ? (pkg.price - unit) * adults + (Math.round(pkg.price * CHILD_RATE) - Math.round(unit * CHILD_RATE)) * children : 0;
  return {
    unit,
    adultsTotal,
    childrenTotal,
    insuranceTotal,
    transferTotal,
    total,
    saved,
    deposit: Math.round(total * DEPOSIT_RATE),
    people,
  };
}
