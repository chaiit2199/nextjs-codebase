import type { Metadata } from "next";
import { DashMain } from "@/components/admin/dash-main";

export const metadata: Metadata = { title: "Khuyến mãi" };

export default function Page() {
  return <DashMain id="promotions-main" />;
}
