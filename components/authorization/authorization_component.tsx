"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-components";
import type { Role, User } from "@/lib/api/types";
import { AssignRoleFormComponent } from "./assign_role_form_component";

export function AuthorizationComponent({ users, roles }: { users: User[]; roles: Role[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      {selectedUser && (
        <AssignRoleFormComponent
          user={selectedUser}
          users={users}
          roles={roles}
          onClose={() => setSelectedUser(null)}
        />
      )}

      <section className="admin-section" id="admin-authorization-section">
        <div className="admin-table-card mb-6">
          <div className="overview-table-wrap">
            <table className="overview-table" id="authorization-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Username</th>
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
                      <td className="w-10">
                        {user.id}
                      </td>
                      <td>
                        <div className="admin-user">
                          <UserAvatar fullname={user.full_name} />
                          <p className="admin-user__name">{user.full_name}</p>
                        </div>
                      </td>
                      <td className="overview-table__muted">{user.username}</td>
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
