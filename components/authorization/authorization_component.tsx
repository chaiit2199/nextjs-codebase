"use client";

import { useEffect, useState } from "react";

import { EmptyData, Pagination, TableHead, TableLoading } from "@/components/core_component";
import { Icon } from "@/components/icon";
import { Tab } from "@/components/tab";
import { UserAvatar } from "@/components/user-components";
import { filterUsers } from "@/lib/api/users";
import type { Role, User } from "@/lib/api/types";
import { USER_STATUS_TABS, type UserStatusTabValue, userStatusMeta } from "@/lib/constants";
import { subscribeHeaderAction } from "@/lib/dashboard/header-actions";
import { AssignRoleFormComponent } from "./assign_role_form_component";

export function AuthorizationComponent({ roles }: { roles: Role[] }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UserStatusTabValue>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[] | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  function openForm(user: User | null) {
    setSelectedUser(user);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedUser(null);
  }

  useEffect(() => {
    return subscribeHeaderAction("/authorization", (detail) => {
      if (detail.action === "authorization") openForm(null);
      if (detail.action === "search") {
        setSearch(detail.query ?? "");
        setPage(1);
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    filterUsers({
      search: search.trim() || undefined,
      status: activeTab === "all" ? undefined : Number(activeTab),
      page,
      page_size: pageSize,
    }).then((result) => {
      if (cancelled || !result.ok) return;
      setUsers(result.data ?? []);
      const total = result.meta?.total ?? result.data?.length ?? 0;
      const size = result.meta?.page_size ?? pageSize;
      setTotalPages(Math.max(1, Math.ceil(total / size)));
    });

    return () => {
      cancelled = true;
    };
  }, [search, activeTab, page, pageSize]);

  return (
    <>
      {isFormOpen && (
        <AssignRoleFormComponent user={selectedUser} users={users ?? []} roles={roles} onClose={closeForm} />
      )}

      <section className="admin-section" id="admin-authorization-section">
        <div className="admin-table-card mb-6">
          <Tab
            tabs={USER_STATUS_TABS}
            activeTab={activeTab}
            onTabClick={(tab) => {
              setActiveTab(tab.value);
              setPage(1);
            }}
          />

          {users === null ? (
            <TableLoading />
          ) : users.length === 0 ? (
            <EmptyData title="Không có nhân viên" description="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." />
          ) : (
            <div className="overview-table-wrap">
              <table className="overview-table" id="authorization-table">
                <colgroup>
                  <col style={{ width: "5rem" }} />
                  <col />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "12rem" }} />
                  <col style={{ width: "3rem" }} />
                </colgroup>
                <thead>
                  <tr>
                    <TableHead icon="hero-hashtag">ID</TableHead>
                    <TableHead icon="hero-users">Tên</TableHead>
                    <TableHead icon="hero-at-symbol">Username</TableHead>
                    <TableHead icon="hero-building-office-2">Phòng ban</TableHead>
                    <TableHead icon="hero-tag">Trạng thái</TableHead>
                    <th className="actions" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const rowId = String(user.id ?? user.username);
                    const meta = userStatusMeta(user.status);

                    return (
                      <tr
                        key={rowId}
                        id={`authorization-row-${rowId}`}
                        className="cursor-pointer"
                        onClick={() => openForm(user)}
                      >
                        <td className="w-10">{user.id}</td>
                        <td>
                          <div className="admin-user">
                            <UserAvatar fullname={user.full_name} />
                            <p className="admin-user__name">{user.full_name}</p>
                          </div>
                        </td>
                        <td className="overview-table__muted">{user.username}</td>
                        <td className="overview-table__muted">{user.department?.name ?? "—"}</td>
                        <td>
                          <span className={`status status--${meta.kind}`}>{meta.label}</span>
                        </td>
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
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </section>
    </>
  );
}
