import type { Metadata } from "next";
import { DashMain } from "@/components/admin/dash-main";

export const metadata: Metadata = { title: "Phòng ban" };

export default function Page() {
  return <DashMain id="departments-main" />;
}
