"use client";

import { useState, type FormEvent } from "react";

import { Modal } from "@/components/core_component";
import { FormSubmitButton } from "@/components/form-submit-button";
import { RequiredLabel, SelectField } from "@/components/form-fields";
import { putFlash } from "@/lib/flash/flash";
import {
  MOCK_ROLES,
  MOCK_USERS,
  MOCK_WAREHOUSES,
  warehouseOptionLabel,
  type AuthorizationRow,
} from "@/lib/mock/authorization";

export type AssignRolePayload = {
  userId: string;
  userLabel: string;
  fullName: string;
  username: string;
  departmentName: string;
  roleId: string;
  roleName: string;
  warehouseCode: string;
  reason: string;
};

function readAssignForm(data: FormData): AssignRolePayload | null {
  const userId = String(data.get("user_id") ?? "").trim();
  const roleId = String(data.get("role_id") ?? "").trim();
  const warehouseCode = String(data.get("warehouse_code") ?? "").trim();
  const reason = String(data.get("reason") ?? "").trim();

  if (!userId || !roleId || !warehouseCode || !reason) return null;

  const user = MOCK_USERS.find((item) => item.id === userId);
  const roleName = MOCK_ROLES.find((role) => role.id === roleId)?.name ?? roleId;

  if (!user) return null;

  return {
    userId,
    userLabel: user.label,
    fullName: user.fullName,
    username: user.username,
    departmentName: user.departmentName,
    roleId,
    roleName,
    warehouseCode,
    reason,
  };
}

export function AssignRoleFormComponent({
  mode,
  row,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  row?: AuthorizationRow | null;
  onClose: () => void;
  onSaved?: (payload: AssignRolePayload, mode: "create" | "edit", rowId?: string) => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payload, setPayload] = useState<AssignRolePayload | null>(null);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formValues = readAssignForm(new FormData(event.currentTarget));
    if (!formValues) return;

    setPayload(formValues);
    setIsConfirmOpen(true);
  }

  function confirmAssign() {
    if (!payload) return;

    onSaved?.(payload, mode, row?.id);
    setIsConfirmOpen(false);
    onClose();
    putFlash(
      "success",
      mode === "create"
        ? `Đã gán ${payload.userLabel} vào vai trò ${payload.roleName}`
        : `Đã cập nhật phân quyền cho ${payload.userLabel}`,
      2000,
    );
  }

  const formKey = `${mode}-${row?.id ?? "new"}`;

  return (
    <>
      <Modal
        id="assign-role-modal"
        show
        title="Gán người dùng vào vai trò"
        subtitle="Phạm vi bị giới hạn theo danh sách vai trò đã cho phép."
        closeable={!isConfirmOpen}
        width="lg"
        onClose={onClose}
      >
        <form
          key={formKey}
          id="assign-role-form"
          className="core_modal__form overflow-hidden"
          autoComplete="off"
          onSubmit={handleFormSubmit}
        >
          <div className="flex flex-col gap-4 overflow-y-auto flex-auto h-full">
            <SelectField
              id="assign-role-user"
              name="user_id"
              label={<RequiredLabel>Người dùng</RequiredLabel>}
              defaultValue={mode === "edit" && row ? row.userId : ""}
              required
            >
              <option value="" disabled>
                Chọn người dùng
              </option>
              {MOCK_USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="assign-role-role"
              name="role_id"
              label={<RequiredLabel>Vai trò</RequiredLabel>}
              defaultValue={mode === "edit" && row?.roleId ? row.roleId : ""}
              required
            >
              <option value="" disabled>
                Chọn vai trò
              </option>
              {MOCK_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="assign-role-warehouse"
              name="warehouse_code"
              label={<RequiredLabel>Kho được truy cập</RequiredLabel>}
              defaultValue={mode === "edit" && row?.warehouseCode ? row.warehouseCode : ""}
              required
            >
              <option value="" disabled>
                Chọn kho
              </option>
              {MOCK_WAREHOUSES.map((warehouse) => (
                <option key={warehouse.code} value={warehouse.code}>
                  {warehouseOptionLabel(warehouse.code)}
                </option>
              ))}
            </SelectField>

            <div className="core_field admin-user-form__full">
              <label htmlFor="assign-role-reason" className="core_label">
                <RequiredLabel>Lý do thay đổi</RequiredLabel>
              </label>
              <textarea
                id="assign-role-reason"
                name="reason"
                rows={3}
                required
                placeholder="Nhập lý do thay đổi phân quyền"
                className="core_input core_input--textarea w-full"
              />
            </div>
          </div>

          <div className="core_modal__actions">
            <button type="button" className="core_button core_button--secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="core_button core_button--primary">
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        id="assign-role-confirm-modal"
        show={isConfirmOpen}
        title={mode === "create" ? "Xác nhận gán người dùng vào vai trò" : "Xác nhận cập nhật phân quyền"}
        width="md"
        className="core_modal--stacked"
        onClose={() => setIsConfirmOpen(false)}
      >
        <form className="core_modal__actions" action={confirmAssign}>
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
