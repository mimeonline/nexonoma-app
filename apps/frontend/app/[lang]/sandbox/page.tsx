import Link from "next/link";

export default function Page() {
  if (process.env.NODE_ENV !== "development") {
    return null; // Seite zeigt nichts in Prod
  }
  return (
    <>
      <div>
        <Link href="/de/sandbox/city-view">City View</Link>
      </div>
      <div>
        <Link href="/de/sandbox/city-grok">City View Grok </Link>
      </div>
      <div>
        <Link href="/de/sandbox/enterprise-city">Enterprise City ChatGPT </Link>
      </div>
      <div>
        <Link href="/de/sandbox/nexonoma-city">Nexonoma City Claude Sonet </Link>
      </div>
    </>
  );
}
