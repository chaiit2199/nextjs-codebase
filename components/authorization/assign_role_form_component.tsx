"use client";

import { useState, type FormEvent } from "react";

import { Input, Modal } from "@/components/core_component";
import { FormSubmitButton } from "@/components/form-submit-button";
import { RequiredLabel, SelectField } from "@/components/form-fields";
import type { User } from "@/lib/api/types";
import { putFlash } from "@/lib/flash/flash";
import { MOCK_ROLES, MOCK_WAREHOUSES, warehouseOptionLabel } from "@/lib/mock/authorization";

type AssignRolePayload = {
  userId: string;
  fullName: string;
  username: string;
  roleId: string;
  roleName: string;
  warehouseCode: string;
  reason: string;
};

function readAssignForm(data: FormData, user: User): AssignRolePayload | null {
  const roleId = String(data.get("role_id") ?? "").trim();
  const warehouseCode = String(data.get("warehouse_code") ?? "").trim();
  const reason = String(data.get("reason") ?? "").trim();
  const userId = String(user.id ?? user.username);

  if (!roleId || !warehouseCode || !reason) return null;

  return {
    userId,
    fullName: user.full_name,
    username: user.username,
    roleId,
    roleName: MOCK_ROLES.find((role) => role.id === roleId)?.name ?? roleId,
    warehouseCode,
    reason,
  };
}

export function AssignRoleFormComponent({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payload, setPayload] = useState<AssignRolePayload | null>(null);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formValues = readAssignForm(new FormData(event.currentTarget), user);
    if (!formValues) return;

    setPayload(formValues);
    setIsConfirmOpen(true);
  }

  function confirmAssign() {
    if (!payload) return;

    setIsConfirmOpen(false);
    onClose();
    putFlash("success", `Đã cập nhật phân quyền cho ${payload.fullName}`, 2000);
  }

  const formKey = String(user.id ?? user.username);

  return (
    <>
      <Modal
        id="assign-role-modal"
        show
        title="Gán người dùng vào vai trò"
        subtitle="Phạm vi bị giới hạn theo danh sách vai trò đã cho phép."
        closeable={!isConfirmOpen}
        width="xl"
        onClose={onClose}
      >
        <form
          key={formKey}
          id="assign-role-form"
          className="core_modal__form overflow-hidden"
          autoComplete="off"
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-auto h-full content-start">
            <Input
              id="assign-role-full-name"
              label="Họ và tên"
              value={user.full_name}
              readOnly
            />
            <Input
              id="assign-role-username"
              label="Tên đăng nhập"
              value={user.username}
              readOnly
            />

            <SelectField
              id="assign-role-role"
              name="role_id"
              label={<RequiredLabel>Vai trò</RequiredLabel>}
              defaultValue={user.role != null && user.role !== "" ? String(user.role) : ""}
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
              defaultValue=""
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

            <div className="core_field md:col-span-2">
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
        title="Xác nhận cập nhật phân quyền"
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
