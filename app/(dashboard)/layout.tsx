import { cookies } from "next/headers";

import { AdminSidebar } from "@/components/admin/sidebar";
import { client } from "@/lib/http/client";
import { SESSION_KEY, decodeSession } from "@/lib/auth/session";

type UserInfo = {
  data: {
    user: {
      username: string;
      full_name: string;
    };
  };
};

async function getCurrentUser() {
  try {
    const session = decodeSession((await cookies()).get(SESSION_KEY)?.value);
    if (!session.access_token) return null;

    const payload = await client.get<UserInfo>("/api/v1/me", {
      accessToken: session.access_token,
    });

    return payload.data.user;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <div className="admin-shell">
      <AdminSidebar user={user} />
      <main className="admin-main">
        <div className="admin-main__inner">{children}</div>
      </main>
    </div>
  );
}
