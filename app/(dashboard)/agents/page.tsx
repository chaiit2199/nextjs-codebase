import type { Metadata } from "next";

import { WipPage } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý đại lý" };

export default function Page() {
  return <WipPage id="agents-main" />;
}
