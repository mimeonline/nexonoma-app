import Sandbox from "./templates/Sandbox";

export default function Page() {
  if (process.env.NODE_ENV !== "development") {
    return null; // Seite zeigt nichts in Prod
  }
  return <Sandbox />;
}
