import type { Metadata } from "next";
import { DashMain } from "@/components/admin/dash-main";

export const metadata: Metadata = { title: "Nhóm quyền" };

export default function Page() {
  return <DashMain id="permission-groups-main" />;
}
