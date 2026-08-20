"use client";

import { useState, type FormEvent } from "react";

import type { Role } from "@/lib/api/me";
import { Icon } from "@/components/icon";
import { Input, Modal } from "@/components/core_component";
import { RequiredLabel } from "@/components/users/user-form";
import { getLabelStatus } from "@/lib/constants";
import { SelectRoles } from "./select_roles_component";

export function PermissionGroupsComponent({ roles }: { roles: Role[] }) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  function openForm(role: Role) {
    setSelectedRole(role);
  }

  function closeForm() {
    setSelectedRole(null);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formValues = {
      id: selectedRole?.id,
      name: String(data.get("name") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
      permissions: data.getAll("permissions").map(String),
    };
    console.log(formValues);
  }

  return (
    <>
      <section className="admin-section" id="admin-permission-groups-section">
        <div className="admin-table-card mb-6">
          <div className="overview-table-wrap">
            <table className="overview-table" id="permission-groups-table">
              <thead>
                <tr>
                  <th>Tên nhóm quyền</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th className="actions" />
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} id={`permission-group-row-${role.id}`}>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td>{getLabelStatus(role.status).label}</td>
                    <td className="actions">
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-actions__btn"
                          aria-label="Chỉnh sửa"
                          onClick={() => openForm(role)}
                        >
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

      <Modal
        id="permission-group-modal"
        show={selectedRole !== null}
        title="Chỉnh sửa nhóm quyền"
        subtitle="Đặt tên nhóm và tick quyền phù hợp."
        closeable="close_button"
        width="xl"
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

              <SelectRoles role={selectedRole} />
            </div>

            <div className="core_modal__actions">
              <button type="button" className="core_button core_button--secondary" onClick={closeForm}>
                Hủy
              </button>
              <button type="submit" id="permission-group-submit" className="core_button core_button--primary">
                <Icon name="hero-check" className="size-4" />
                Lưu nhóm quyền
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
