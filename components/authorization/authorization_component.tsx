"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-components";
import { subscribeHeaderAction } from "@/lib/dashboard/header-actions";
import { MOCK_AUTHORIZATIONS, type AuthorizationRow } from "@/lib/mock/authorization";
import {
  AssignRoleFormComponent,
  type AssignRolePayload,
} from "./assign_role_form_component";

type FormState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; row: AuthorizationRow };

export function AuthorizationComponent() {
  const [rows, setRows] = useState(MOCK_AUTHORIZATIONS);
  const [formState, setFormState] = useState<FormState>({ open: false });

  function openCreateForm() {
    setFormState({ open: true, mode: "create" });
  }

  function openEditForm(row: AuthorizationRow) {
    setFormState({ open: true, mode: "edit", row });
  }

  function closeForm() {
    setFormState({ open: false });
  }

  function handleSaved(payload: AssignRolePayload, mode: "create" | "edit", rowId?: string) {
    const nextRow: AuthorizationRow = {
      id: rowId ?? String(Date.now()),
      userId: payload.userId,
      fullName: payload.fullName,
      username: payload.username,
      departmentName: payload.departmentName,
      roleId: payload.roleId,
      roleName: payload.roleName,
      warehouseCode: payload.warehouseCode,
    };

    if (mode === "create") {
      setRows((current) => {
        const existingIndex = current.findIndex((row) => row.userId === payload.userId);
        if (existingIndex >= 0) {
          return current.map((row, index) => (index === existingIndex ? { ...row, ...nextRow, id: row.id } : row));
        }
        return [nextRow, ...current];
      });
      return;
    }

    if (!rowId) return;

    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, ...nextRow, id: row.id } : row)));
  }

  useEffect(() => {
    return subscribeHeaderAction("/authorization", (detail) => {
      if (detail.action === "authorization") openCreateForm();
    });
  }, []);

  return (
    <>
      {formState.open && formState.mode === "create" && (
        <AssignRoleFormComponent mode="create" onClose={closeForm} onSaved={handleSaved} />
      )}

      {formState.open && formState.mode === "edit" && (
        <AssignRoleFormComponent
          mode="edit"
          row={formState.row}
          onClose={closeForm}
          onSaved={handleSaved}
        />
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
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    id={`authorization-row-${row.id}`}
                    className="cursor-pointer"
                    onClick={() => openEditForm(row)}
                  >
                    <td>
                      <div className="admin-user">
                        <UserAvatar fullname={row.fullName} />
                        <p className="admin-user__name">{row.fullName}</p>
                      </div>
                    </td>
                    <td className="overview-table__muted">{row.roleName ?? "—"}</td>
                    <td className="overview-table__muted">{row.departmentName}</td>
                    <td className="actions bg-transparent">
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
    </>
  );
}
