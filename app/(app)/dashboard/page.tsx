import { DashboardView } from "./DashboardView";

// Renders after the client reads the mock session, so not an instant navigation.
export const instant = false;

export default function DashboardPage() {
  return <DashboardView />;
}
