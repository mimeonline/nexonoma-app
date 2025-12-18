"use client";

import { ReferrerNav } from "@/features/catalog/organisms/ReferrerNav";

type Props = {
  segmentName?: string;
  clusterName?: string;
  macroClusterName?: string;
};

export default function ReferrerNavClient(props: Props) {
  return <ReferrerNav {...props} />;
}
