"use client";

import { useState, type FormEvent } from "react";

import { Input, Modal } from "@/components/core_component";
import { FormSubmitButton } from "@/components/form-submit-button";
import { RequiredLabel } from "@/components/form-fields";
import { Icon } from "@/components/icon";
import { createRole, type CreateRoleInput } from "@/lib/api/roles";
import type { ShortRole } from "@/lib/api/types";
import { putFlash } from "@/lib/flash/flash";
import { SelectRoles } from "./select_roles_component";

type CreateRoleProfile = {
  name: string;
  code: string;
  description: string;
  allowed_scope_types: number[];
};

export function suggestRoleCode(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function CreatePermissionGroupComponent({
  onClose,
  shortRoles,
}: {
  onClose: () => void;
  shortRoles: ShortRole[];
}) {
  const [step, setStep] = useState<"profile" | "permissions">("profile");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [profile, setProfile] = useState<CreateRoleProfile | null>(null);
  const [payload, setPayload] = useState<CreateRoleInput | null>(null);
  const [scopes, setScopes] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeEdited, setCodeEdited] = useState(false);

  function toggleScope(value: number) {
    setScopes((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!codeEdited) setCode(suggestRoleCode(value));
  }

  function handleCodeChange(value: string) {
    setCodeEdited(true);
    setCode(value);
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const roleName = name.trim();
    const roleCode = code.trim();
    if (!roleName || !roleCode || scopes.length === 0) return;

    setProfile({
      name: roleName,
      code: roleCode,
      description: String(data.get("description") ?? "").trim(),
      allowed_scope_types: scopes,
    });
    setStep("permissions");
  }

  function handlePermissionsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;

    const formValues: CreateRoleInput = {
      ...profile,
      permission_codes: new FormData(event.currentTarget).getAll("permissions").map(String),
    };

    setPayload(formValues);
    setIsConfirmOpen(true);
  }

  async function confirmCreate() {
    if (!payload) return;

    const result = await createRole(payload);

    if (!result.ok) {
      setIsConfirmOpen(false);
      putFlash("error", result.message, 2000);
      return;
    }

    onClose();
    putFlash("success", "Thêm nhóm quyền thành công", 2000);
  }

  return (
    <>
      <Modal
        id="create-permission-group-modal"
        show
        title="Tạo mới nhóm quyền"
        subtitle={
          step === "profile"
            ? "Đặt tên vai trò và chọn phạm vi dữ liệu được phép."
            : "Tick quyền phù hợp cho nhóm quyền."
        }
        closeable={!isConfirmOpen}
        width="3xl"
        onClose={onClose}
      >
        {step === "profile" ? (
          <form
            id="create-permission-group-profile-form"
            className="core_modal__form overflow-hidden flex-auto h-full flex flex-col"
            autoComplete="off"
            onSubmit={handleProfileSubmit}
          >
            <div className="flex-auto h-full overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <Input
                  id="create-permission-group-name"
                  name="name"
                  label={<RequiredLabel>Tên vai trò</RequiredLabel>}
                  placeholder="Ví dụ: Quản lý khu vực"
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  required
                />
                <Input
                  id="create-permission-group-code"
                  name="code"
                  label={<RequiredLabel>Mã vai trò</RequiredLabel>}
                  placeholder="QUAN_LY_KHU_VUC"
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  required
                />
              </div>

              <div className="core_field mb-5">
                <label htmlFor="create-permission-group-description" className="core_label">
                  Mô tả
                </label>
                <textarea
                  id="create-permission-group-description"
                  name="description"
                  rows={3}
                  placeholder="Mô tả ngắn (có thể bỏ trống)"
                  defaultValue={profile?.description}
                  className="core_input core_input--textarea w-full"
                />
              </div>

              <div className="core_field">
                <p className="core_label">
                  <RequiredLabel>Phạm vi dữ liệu</RequiredLabel>
                </p>
                <div className="auth-scope">
                  {shortRoles.map((role) => {
                    const isChecked = scopes.includes(role.id);

                    return (
                      <button
                        key={role.id}
                        type="button"
                        className={["auth-scope__item", isChecked && "is-checked"].filter(Boolean).join(" ")}
                        onClick={() => toggleScope(role.id)}
                      >
                        <span
                          className={["auth-permission__check", isChecked && "is-checked"]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {isChecked && <Icon name="hero-check" className="size-3.5" />}
                        </span>
                        <span className="auth-scope__name">{role.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="core_modal__actions">
              <button type="button" className="core_button core_button--secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="core_button core_button--primary" disabled={scopes.length === 0}>
                Tạo role và tiếp tục
              </button>
            </div>
          </form>
        ) : (
          <form
            id="create-permission-group-permissions-form"
            className="core_modal__form overflow-hidden flex-auto h-full flex flex-col"
            autoComplete="off"
            onSubmit={handlePermissionsSubmit}
          >
            <div className="flex-auto h-full overflow-y-auto">
              <SelectRoles />
            </div>
            <div className="core_modal__actions">
              <button
                type="button"
                className="core_button core_button--secondary"
                onClick={() => setStep("profile")}
              >
                Quay lại
              </button>
              <button type="submit" className="core_button core_button--primary">
                Xác nhận thêm nhóm quyền
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        id="create-permission-group-confirm-modal"
        show={isConfirmOpen}
        title="Xác nhận thêm nhóm quyền"
        width="md"
        className="core_modal--stacked"
        onClose={() => setIsConfirmOpen(false)}
      >
        <form className="core_modal__actions" action={confirmCreate}>
          <button
            type="button"
            className="core_button core_button--secondary"
            onClick={() => setIsConfirmOpen(false)}
          >
            Hủy
          </button>
          <FormSubmitButton>Thêm nhóm quyền</FormSubmitButton>
        </form>
      </Modal>
    </>
  );
}
