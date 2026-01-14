import { Overview360Template } from "@/features/overview360/templates/Overview360";
import { createOverview360Api } from "@/services/overview360Api";

export default async function Overview360Page({ params }: PageProps<"/[lang]/360">) {
  const { lang } = await params;
  const api = createOverview360Api(lang);
  const data = await api.getOverview();

  return <Overview360Template data={data} />;
}
