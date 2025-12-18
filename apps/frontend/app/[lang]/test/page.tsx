// src/app/grid/page.tsx
import { NexonomaApi } from "@/services/api";

export default async function Page() {
  // Das läuft auf dem Server! Kein useEffect nötig.
  const data = await NexonomaApi.getCatalog();
  console.log("Catalog Data:", data);
  return;
  <>
    <div>empty</div>
  </>;
}
