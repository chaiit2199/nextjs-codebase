import type { Metadata } from "next";

import { DashMain } from "@/components/admin/dash-main";
import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/users/user-components";
import { MOCK_STAFF } from "@/lib/mock/overview";

export const metadata: Metadata = { title: "Nhân viên" };

export default function AdminPage() {
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
                {MOCK_STAFF.map((user) => (
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
                    <td className="overview-table__muted">{user.department_label}</td>
                    <td>
                      <span className={`admin-status admin-status--${user.status.kind}`}>
                        {user.status.label}
                      </span>
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
