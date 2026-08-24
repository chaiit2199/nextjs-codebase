"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-components";
import { roleLabel } from "@/components/users/avatar";
import type { User } from "@/lib/api/types";
import { AssignRoleFormComponent } from "./assign_role_form_component";

export function AuthorizationComponent({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      {selectedUser && (
        <AssignRoleFormComponent user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      <section className="admin-section" id="admin-authorization-section">
        <div className="admin-table-card mb-6">
          <div className="overview-table-wrap">
            <table className="overview-table" id="authorization-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Vai trò</th>
                  <th>Phòng ban</th>
                  <th className="actions" />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const rowId = String(user.id ?? user.username);

                  return (
                    <tr
                      key={rowId}
                      id={`authorization-row-${rowId}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td>
                        <div className="admin-user">
                          <UserAvatar fullname={user.full_name} />
                          <p className="admin-user__name">{user.full_name}</p>
                        </div>
                      </td>
                      <td className="overview-table__muted">
                        {user.role != null && user.role !== "" ? roleLabel(user.role) : "—"}
                      </td>
                      <td className="overview-table__muted">{user.department?.name ?? "—"}</td>
                      <td className="actions bg-transparent">
                        <div className="admin-actions">
                          <button type="button" className="admin-actions__btn" aria-label="Chỉnh sửa">
                            <Icon name="hero-pencil-square" className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
