import { CityView } from "./CityView";

export default function Sandbox() {
  if (process.env.NODE_ENV !== "development") {
    return null; // Seite zeigt nichts in Prod
  }
  return <CityView></CityView>;
}
