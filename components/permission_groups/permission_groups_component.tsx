"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Input, Modal, EmptyData, Pagination, TableHead, TableLoading } from "@/components/core_component";
import { FormSubmitButton } from "@/components/form-submit-button";
import { RequiredLabel } from "@/components/form-fields";
import { Icon } from "@/components/icon";
import { Tab } from "@/components/tab";
import { fetchRolePermissions, filterRoles, updateRole, type UpdateRoleInput } from "@/lib/api/roles";
import type { Permission, Role, ScopeType } from "@/lib/api/types";
import { USER_STATUS_TABS, type UserStatusTabValue, roleStatusMeta } from "@/lib/constants";
import { subscribeHeaderAction } from "@/lib/dashboard/header-actions";
import { putFlash } from "@/lib/flash/flash";
import { readUpdateRoleForm } from "@/lib/roles/read-update-role-form";
import { SelectRoles } from "./select_roles_component";
import { CreatePermissionGroupComponent } from "./create_permission_group_component";

export function PermissionGroupsComponent({
  scopeTypes,
  permissions,
}: {
  scopeTypes: ScopeType[];
  permissions: Permission[];
}) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<UserStatusTabValue>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [reloadAt, setReloadAt] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [scopePermissions, setScopePermissions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payload, setPayload] = useState<UpdateRoleInput | null>(null);
  const [userPermissionIds, setUserPermissionIds] = useState<number[] | null>(null);
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(false);

  useEffect(() => {
    return subscribeHeaderAction("/permission", (detail) => {
      if (detail.action === "create") setIsCreateOpen(true);
      if (detail.action === "search") {
        setSearch(detail.query ?? "");
        setPage(1);
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    filterRoles({
      search: search.trim() || undefined,
      status: activeTab === "all" ? "ALL" : Number(activeTab),
      page,
      page_size: pageSize,
    }).then((result) => {
      if (cancelled || !result.ok) return;
      setRoles(result.data ?? []);
      const total = result.meta?.total ?? result.data?.length ?? 0;
      const size = result.meta?.page_size ?? pageSize;
      setTotalPages(Math.max(1, Math.ceil(total / size)));
    });

    return () => {
      cancelled = true;
    };
  }, [search, activeTab, page, pageSize, reloadAt]);

  async function openForm(role: Role) {
    setSelectedRole(role);
    setPayload(null);
    setIsConfirmOpen(false);
    setUserPermissionIds(null);
    setIsPermissionsLoading(true);

    try {
      const userPermissions = await fetchRolePermissions(role.id);
      setScopePermissions(userPermissions.role.allowed_scope_types);
      setUserPermissionIds(userPermissions.permissions.map((permission) => permission.id));
    } catch (error) {
      setSelectedRole(null);
      putFlash("error", error instanceof Error ? error.message : "Không tải được danh sách quyền", 1500);
    } finally {
      setIsPermissionsLoading(false);
    }
  }

  function closeForm() {
    setPayload(null);
    setIsConfirmOpen(false);
    setUserPermissionIds(null);
    setScopePermissions([]);
    setIsPermissionsLoading(false);
    setSelectedRole(null);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRole || !userPermissionIds) return;

    const formValues = readUpdateRoleForm(new FormData(event.currentTarget), selectedRole, userPermissionIds);
    if (!formValues) return;

    setPayload(formValues);
    setIsConfirmOpen(true);
  }

  async function confirmUpdate() {
    if (!payload) return;

    const result = await updateRole(payload);

    if (!result.ok) {
      setIsConfirmOpen(false);
      putFlash("error", result.message, 1500);
      return;
    }

    closeForm();
    setReloadAt((value) => value + 1);
    putFlash("success", "Cập nhật nhóm quyền thành công", 1500);
  }

  return (
    <>
      {isCreateOpen && (
        <CreatePermissionGroupComponent
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => setReloadAt((value) => value + 1)}
          scopeTypes={scopeTypes}
        />
      )}
      <section className="admin-section" id="admin-permission-section">
        <div className="admin-table-card mb-6">
          <Tab
            tabs={USER_STATUS_TABS}
            activeTab={activeTab}
            onTabClick={(tab) => {
              setActiveTab(tab.value);
              setPage(1);
            }}
          />

          {roles === null ? (
            <TableLoading />
          ) : roles.length === 0 ? (
            <EmptyData title="Không có nhóm quyền" description="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." />
          ) : (
            <div className="overview-table-wrap">
              <table className="overview-table" id="permission-table">
                <colgroup>
                  <col style={{ width: "14rem" }} />
                  <col style={{ width: "12rem" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "12rem" }} />
                  <col style={{ width: "12rem" }} />
                  <col style={{ width: "3rem" }} />
                </colgroup>
                <thead>
                  <tr>
                    <TableHead icon="hero-user-group">Tên nhóm quyền</TableHead>
                    <TableHead icon="hero-tag">Trạng thái</TableHead>
                    <TableHead icon="hero-document-text">Mô tả</TableHead>
                    <TableHead icon="hero-calendar-days">Ngày tạo</TableHead>
                    <TableHead icon="hero-calendar-days">Ngày hiệu lực</TableHead>
                    <th className="actions" />
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => {
                    const meta = roleStatusMeta(role.status);
                    return (
                      <tr
                        key={role.id}
                        id={`permission-group-row-${role.id}`}
                        onClick={() => openForm(role)}
                        className="cursor-pointer"
                      >
                        <td>{role.name}</td>
                        <td>
                          <span className={`status status--${meta.kind}`}>{meta.label}</span>
                        </td>
                        <td>{role.description}</td>
                        <td>dd/mm/yyyy</td>
                        <td>dd/mm/yyyy</td>
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

      <Modal
        id="permission-group-modal"
        show={selectedRole !== null}
        title="Chỉnh sửa nhóm quyền"
        subtitle="Đặt tên nhóm và tick quyền phù hợp."
        closeable={!isConfirmOpen}
        width="3xl"
        onClose={closeForm}
      >
        {selectedRole && (
          <form
            key={selectedRole.id}
            id="permission-group-form"
            className="core_modal__form overflow-hidden flex-auto h-full flex flex-col"
            autoComplete="off"
            onSubmit={handleFormSubmit}
          >
            <div className="flex-auto h-full overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 mb-5">
                <Input
                  id="permission-group-name"
                  name="name"
                  label={<RequiredLabel>Tên nhóm quyền</RequiredLabel>}
                  placeholder="Ví dụ: Quản lý kho"
                  defaultValue={selectedRole.name}
                  required
                />
                <div className="core_field">
                  <label htmlFor="permission-group-description" className="core_label">
                    Mô tả
                  </label>
                  <textarea
                    id="permission-group-description"
                    name="description"
                    rows={2}
                    placeholder="Mô tả ngắn (có thể bỏ trống)"
                    defaultValue={selectedRole.description}
                    className="core_input core_input--textarea w-full"
                  />
                </div>
              </div>

              {isPermissionsLoading ? (
                <p className="text-sm text-slate-500">Đang tải danh sách quyền...</p>
              ) : userPermissionIds ? (
                <SelectRoles
                  permissions={permissions}
                  scopePermissions={scopePermissions}
                  selectedPermissionIds={userPermissionIds}
                />
              ) : null}
            </div>

            <div className="core_modal__actions">
              <button type="button" className="core_button core_button--secondary" onClick={closeForm}>
                Hủy
              </button>
              <button type="submit" id="permission-group-submit" className="core_button core_button--primary">
                Cập nhật nhóm quyền
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        id="update-permission-group-confirm-modal"
        show={isConfirmOpen}
        title="Xác nhận cập nhật nhóm quyền"
        width="md"
        className="core_modal--stacked"
        onClose={() => setIsConfirmOpen(false)}
      >
        <form className="core_modal__actions" action={confirmUpdate}>
          <button
            type="button"
            className="core_button core_button--secondary"
            onClick={() => setIsConfirmOpen(false)}
          >
            Hủy
          </button>
          <FormSubmitButton>Xác nhận</FormSubmitButton>
        </form>
      </Modal>
    </>
  );
}
