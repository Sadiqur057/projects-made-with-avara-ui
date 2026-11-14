import { AssistantView } from "./AssistantView";

// Renders after the client reads the mock session, so not an instant navigation.
export const instant = false;

export default function AssistantPage() {
  return <AssistantView />;
}
