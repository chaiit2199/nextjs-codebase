import type { Metadata } from "next";

import { DashMain } from "@/components/admin/dash-main";
import { Icon } from "@/components/icon";

import { getUsers } from "@/lib/api/me";
import { userStatusMeta } from "@/components/users/status";
import { UserAvatar } from "@/server_component/users/user-components";

export const metadata: Metadata = { title: "Nhân viên" };

export default async function AdminPage() {
  const users = await getUsers();

  return (
    <DashMain id="admin-main">
      <section className="admin-section" id="admin-users-section">
        <div className="admin-table-card mb-6">
          <div className="overview-table-wrap">
            <table className="overview-table" id="users-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Tên đăng nhập</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Phòng ban</th>
                  <th>Trạng thái</th>
                  <th className="actions" />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} id={`user-row-${user.id}`}>
                    <td>
                      <div className="admin-user">
                        <UserAvatar fullname={user.full_name} />
                        <p className="admin-user__name">{user.full_name}</p>
                      </div>
                    </td>
                    <td className="overview-table__muted">{user.username}</td>
                    <td className="overview-table__muted">{user.phone}</td>
                    <td className="overview-table__muted">{user.address}</td>
                    <td className="overview-table__muted">{user.department ?? "—"}</td>
                    <td>
                      <UserStatusBadge status={user.status} />
                    </td>
                    <td className="actions">
                      <div className="admin-actions">
                        <button type="button" className="admin-actions__btn" aria-label="Chỉnh sửa">
                          <Icon name="hero-pencil-square" className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashMain>
  );
}

function UserStatusBadge({ status }: { status?: number }) {
  const meta = userStatusMeta(status);

  return (
    <span className={`admin-status admin-status--${meta.kind}`}>
      {meta.label}
    </span>
  );
}
