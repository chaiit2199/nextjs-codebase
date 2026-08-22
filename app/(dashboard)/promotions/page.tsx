import type { Metadata } from "next";

import { WipPage } from "@/components/dashboard";

export const metadata: Metadata = { title: "Khuyến mãi" };

export default function Page() {
  return <WipPage id="promotions-main" />;
}
