"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import { Input, Modal, useDropdownClose } from "@/components/core_component";
import { changePassword } from "@/lib/auth/users";
import { putFlash } from "@/lib/flash";
import {
  PASSWORD_MIN_LENGTH,
  hasPasswordErrors,
  validateChangePassword,
} from "@/lib/auth/password";

export function ChangePasswordComponent() {
  const closeDropdown = useDropdownClose();
  const [open, setOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ReturnType<typeof validateChangePassword>>({});

  function onClose() {
    setFieldErrors({});
    setOpen(false);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      current_password: String(data.get("current_password") ?? ""),
      new_password: String(data.get("new_password") ?? ""),
      new_password_confirmation: String(data.get("new_password_confirmation") ?? ""),
    };

    const nextFieldErrors = validateChangePassword(values);
    setFieldErrors(nextFieldErrors);

    if (hasPasswordErrors(nextFieldErrors)) return;

    const result = await changePassword({
      current_password: values.current_password,
      new_password: values.new_password,
    });

    if (!result.ok) {
      putFlash("error", result.message, 2000);
      return;
    }

    form.reset();
    setFieldErrors({});
    setOpen(false);
    putFlash("success", "Đổi mật khẩu thành công", 2000);
  }

  return (
    <>
      <button
        onClick={() => {
          closeDropdown?.();
          setOpen(true);
        }}
        type="button"
        id="open-change-password"
        className="header-menu__item"
        role="menuitem"
      >
        <Icon name="hero-lock-closed" className="header-menu__icon" />
        <span>Đổi mật khẩu</span>
      </button>

      <Modal
        id="change-password-modal"
        show={open}
        title="Đổi mật khẩu"
        subtitle="Đặt lại mật khẩu mới để bảo mật tài khoản của bạn."
        closeable="close_button"
        width="md"
        onClose={onClose}
      >
        <form
          id="change-password-form"
          className="core_modal__form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <Input
            id="change-password-current"
            name="current_password"
            type="password"
            label="Mật khẩu hiện tại *"
            placeholder="Nhập mật khẩu hiện tại"
            autoComplete="off"
            minLength={PASSWORD_MIN_LENGTH}
            required
            error={fieldErrors.current_password}
          />
          <Input
            id="change-password-new"
            name="new_password"
            type="password"
            label="Mật khẩu mới *"
            placeholder={`Tối thiểu ${PASSWORD_MIN_LENGTH} ký tự`}
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            required
            error={fieldErrors.new_password}
          />
          <Input
            id="change-password-confirm"
            name="new_password_confirmation"
            type="password"
            label="Xác nhận mật khẩu mới *"
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            required
            error={fieldErrors.new_password_confirmation}
          />

          <div className="core_modal__actions">
            <button
              type="button"
              className="core_button core_button--secondary"
              onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="core_button core_button--primary">
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
