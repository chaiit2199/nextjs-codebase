import type { Metadata } from "next";

import { WipPage } from "@/components/dashboard";
import { pageMetadata } from "@/lib/dashboard/navbar";

export const metadata: Metadata = pageMetadata("/orders");

export default function Page() {
  return <WipPage id="orders-main" />;
}
