import {
  CalendarClock,
  CheckCheck,
  FilePlus2,
  Hourglass,
  Mail,
  Mic,
  Settings,
  Sparkles,
  UserPlus,
  Users,
  UsersRound,
  Video,
} from "lucide-react";
import type {
  DashboardActivity,
  DashboardAuthor,
  DashboardMetric,
  DashboardPayment,
  DashboardPeriod,
  DashboardPoint,
  DashboardShare,
  DashboardShortcut,
  DashboardTotal,
} from "@/components/custom/blocks/DashboardBlock";

// All numbers here are mock data for Notewise, a fictional meeting-notes app.

const DAYS = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
const WEEKS = ["Sep 1", "Sep 8", "Sep 15", "Sep 22", "Sep 29"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

/** One series per period from plain numbers, oldest first. */
const series = (
  day: number[],
  week: number[],
  month: number[],
): Record<DashboardPeriod, DashboardPoint[]> => ({
  day: day.map((value, i) => ({
    label: DAYS[i] ?? "",
    shortLabel: DAYS[i]?.charAt(0),
    value,
  })),
  week: week.map((value, i) => ({
    label: WEEKS[i] ?? "",
    shortLabel: WEEKS[i]?.split(" ")[1],
    fullLabel: `Week of ${WEEKS[i]}`,
    value,
  })),
  month: month.map((value, i) => ({
    label: MONTHS[i] ?? "",
    shortLabel: MONTHS[i]?.charAt(0),
    value,
  })),
});

export const TOTALS: DashboardTotal[] = [
  { label: "Meetings recorded", value: 1284, icon: <Video />, metric: "meetings", href: "/dashboard#activity" },
  { label: "Hours transcribed", value: 3906, icon: <Mic />, metric: "hours", href: "/dashboard#activity" },
  { label: "Action items", value: 5210, icon: <CheckCheck />, metric: "actions", href: "/assistant" },
  { label: "Team members", value: 48, icon: <UsersRound />, metric: "members" },
];

export const METRICS: DashboardMetric[] = [
  {
    id: "meetings",
    label: "Meetings",
    icon: <Video />,
    noun: ["meeting recorded", "meetings recorded"],
    series: series(
      [14, 18, 6, 3, 21, 26, 11],
      [96, 118, 104, 131, 52],
      [310, 348, 402, 389, 441, 470, 462, 518, 405],
    ),
    change: { day: 12.5, week: 6.8, month: 9.1 },
  },
  {
    id: "hours",
    label: "Hours",
    icon: <Hourglass />,
    noun: ["hour transcribed", "hours transcribed"],
    series: series(
      [11, 15, 4, 2, 19, 23, 9],
      [82, 96, 90, 112, 41],
      [260, 288, 340, 322, 372, 395, 388, 436, 341],
    ),
    change: { day: -4.2, week: 3.1, month: 5.6 },
  },
  {
    id: "actions",
    label: "Action items",
    icon: <CheckCheck />,
    noun: ["action item", "action items"],
    series: series(
      [38, 52, 12, 8, 64, 71, 29],
      [248, 301, 276, 334, 120],
      [880, 940, 1080, 1010, 1160, 1230, 1190, 1310, 1090],
    ),
    change: { day: 2.3, week: -1.8, month: 4.4 },
  },
  {
    id: "members",
    label: "New members",
    icon: <UserPlus />,
    noun: ["new teammate", "new teammates"],
    series: series(
      [1, 2, 0, 0, 3, 2, 1],
      [6, 9, 7, 11, 3],
      [14, 18, 22, 19, 25, 27, 24, 31, 22],
    ),
    change: { day: 6.2, week: 4.9, month: 7.7 },
  },
];

// Times are relative to the visitor's clock so the feed always reads as recent.
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

// Activity types are fixed by the component: user, post, payment, message.
// Here: user = teammate, post = shared summary, message = action item,
// payment = plan billing.
export const ACTIVITY: DashboardActivity[] = [
  { id: 1, type: "post", title: "Q4 roadmap sync: summary shared", subtitle: "By Ayesha Rahman", person: "Ayesha Rahman", date: minutesAgo(6) },
  { id: 2, type: "message", title: "Update the launch brief", subtitle: "Assigned to Mei Tanaka · due Fri", person: "Mei Tanaka", date: minutesAgo(21) },
  { id: 3, type: "user", title: "Priya Nair joined the workspace", subtitle: "Invited by Ayesha Rahman", person: "Priya Nair", date: minutesAgo(48) },
  { id: 4, type: "payment", title: "Team plan renewed", subtitle: "12 seats, yearly · $2,016.00", person: "Notewise Billing", date: minutesAgo(95) },
  { id: 5, type: "post", title: "Customer discovery #14: summary shared", subtitle: "By Daniel Brooks", person: "Daniel Brooks", date: minutesAgo(150) },
  { id: 6, type: "message", title: "Send pricing revisions to legal", subtitle: "Assigned to Marcus Chen · due Mon", person: "Marcus Chen", date: minutesAgo(190) },
  { id: 7, type: "post", title: "Design critique: summary shared", subtitle: "By Sofia Alvarez", person: "Sofia Alvarez", date: minutesAgo(26 * 60) },
  { id: 8, type: "user", title: "Liam O'Connor joined the workspace", subtitle: "Invited by Daniel Brooks", person: "Liam O'Connor", date: minutesAgo(28 * 60) },
  { id: 9, type: "message", title: "Book the onboarding workshop", subtitle: "Assigned to Hana Kobayashi · done", person: "Hana Kobayashi", date: minutesAgo(30 * 60) },
  { id: 10, type: "payment", title: "2 seats added", subtitle: "Prorated · $56.00", person: "Notewise Billing", date: minutesAgo(50 * 60) },
  { id: 11, type: "post", title: "Weekly standup: summary shared", subtitle: "By Omar Haddad", person: "Omar Haddad", date: minutesAgo(52 * 60) },
  { id: 12, type: "message", title: "Share the Q3 retro notes", subtitle: "Assigned to Ayesha Rahman · done", person: "Ayesha Rahman", date: minutesAgo(55 * 60) },
];

// "sources" is the component's second donut: here, where meetings happen.
export const SOURCES: Record<DashboardPeriod, DashboardShare[]> = {
  day: [
    { id: "zoom", label: "Zoom", value: 41 },
    { id: "meet", label: "Google Meet", value: 28 },
    { id: "teams", label: "Microsoft Teams", value: 14 },
    { id: "inperson", label: "In person", value: 6 },
    { id: "huddle", label: "Slack huddle", value: 3 },
  ],
  week: [
    { id: "zoom", label: "Zoom", value: 268 },
    { id: "meet", label: "Google Meet", value: 171 },
    { id: "teams", label: "Microsoft Teams", value: 90 },
    { id: "inperson", label: "In person", value: 41 },
    { id: "huddle", label: "Slack huddle", value: 25 },
  ],
  month: [
    { id: "zoom", label: "Zoom", value: 1120 },
    { id: "meet", label: "Google Meet", value: 712 },
    { id: "teams", label: "Microsoft Teams", value: 394 },
    { id: "inperson", label: "In person", value: 188 },
    { id: "huddle", label: "Slack huddle", value: 96 },
  ],
};

// Invited teammates who signed up, per period.
export const SIGN_UPS: Record<DashboardPeriod, number> = { day: 7, week: 36, month: 202 };

// "countries" is meeting volume by region.
export const COUNTRIES: Record<DashboardPeriod, DashboardShare[]> = {
  day: [
    { id: "us", code: "US", label: "United States", value: 34 },
    { id: "gb", code: "GB", label: "United Kingdom", value: 16 },
    { id: "de", code: "DE", label: "Germany", value: 11 },
    { id: "in", code: "IN", label: "India", value: 9 },
    { id: "ca", code: "CA", label: "Canada", value: 7 },
    { id: "bd", code: "BD", label: "Bangladesh", value: 5 },
  ],
  week: [
    { id: "us", code: "US", label: "United States", value: 221 },
    { id: "gb", code: "GB", label: "United Kingdom", value: 103 },
    { id: "de", code: "DE", label: "Germany", value: 81 },
    { id: "in", code: "IN", label: "India", value: 69 },
    { id: "ca", code: "CA", label: "Canada", value: 50 },
    { id: "bd", code: "BD", label: "Bangladesh", value: 41 },
  ],
  month: [
    { id: "us", code: "US", label: "United States", value: 812 },
    { id: "gb", code: "GB", label: "United Kingdom", value: 394 },
    { id: "de", code: "DE", label: "Germany", value: 301 },
    { id: "in", code: "IN", label: "India", value: 259 },
    { id: "ca", code: "CA", label: "Canada", value: 188 },
    { id: "bd", code: "BD", label: "Bangladesh", value: 161 },
  ],
};

// "authors" is who ran the most meetings.
export const AUTHORS: Record<DashboardPeriod, DashboardAuthor[]> = {
  day: [
    { name: "Ayesha Rahman", posts: 4 },
    { name: "Daniel Brooks", posts: 3 },
    { name: "Priya Nair", posts: 2 },
    { name: "Marcus Chen", posts: 2 },
    { name: "Sofia Alvarez", posts: 1 },
  ],
  week: [
    { name: "Ayesha Rahman", posts: 22 },
    { name: "Daniel Brooks", posts: 17 },
    { name: "Priya Nair", posts: 13 },
    { name: "Marcus Chen", posts: 11 },
    { name: "Sofia Alvarez", posts: 8 },
  ],
  month: [
    { name: "Ayesha Rahman", posts: 88 },
    { name: "Daniel Brooks", posts: 71 },
    { name: "Priya Nair", posts: 54 },
    { name: "Marcus Chen", posts: 47 },
    { name: "Sofia Alvarez", posts: 33 },
    { name: "Liam O'Connor", posts: 21 },
  ],
};

export const PAYMENTS: DashboardPayment[] = [
  { id: "inv_1", amount: 2016, currency: "USD", method: "Visa ·· 4242", person: "Notewise Team plan", date: minutesAgo(95) },
  { id: "inv_2", amount: 56, currency: "USD", method: "Visa ·· 4242", person: "2 added seats", date: minutesAgo(50 * 60) },
  { id: "inv_3", amount: 180, currency: "USD", method: "Visa ·· 4242", status: "pending", person: "Business trial upgrade", date: minutesAgo(80 * 60) },
  { id: "inv_4", amount: 2016, currency: "USD", method: "Visa ·· 4242", person: "Notewise Team plan", date: minutesAgo(400 * 60) },
  { id: "inv_5", amount: 14, currency: "USD", method: "Visa ·· 4242", status: "failed", person: "1 added seat", date: minutesAgo(560 * 60) },
];

export const SHORTCUTS: DashboardShortcut[] = [
  { label: "New meeting", href: "/dashboard", icon: <FilePlus2 /> },
  { label: "Ask the AI", href: "/assistant", icon: <Sparkles /> },
  { label: "Team", href: "/dashboard", icon: <Users /> },
  { label: "Recaps", href: "/dashboard", icon: <Mail /> },
  { label: "Calendar", href: "/dashboard", icon: <CalendarClock /> },
  { label: "Settings", href: "/dashboard", icon: <Settings /> },
];
