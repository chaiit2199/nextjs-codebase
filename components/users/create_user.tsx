"use client";

import { useState } from "react";
import { Modal } from "@/components/core_component";
import { createUser } from "@/lib/auth/users";

export function AddUserButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    // Server Action → client.post("/api/v1/users", body)
    const result = await createUser({
      full_name: String(data.get("full_name") ?? ""),
      username: String(data.get("username") ?? ""),
      password: String(data.get("password") ?? ""),
      phone: String(data.get("phone") ?? ""),
      address: String(data.get("address") ?? ""),
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    form.reset();
    setOpen(false);
  }

  function onClose() {
    if (loading) return;
    setError("");
    setOpen(false);
  }

  return (
    <>
      <button type="button" className="admin-create-btn" onClick={() => setOpen(true)}>
        Thêm user
      </button>

      <Modal
        id="add-user-modal"
        show={open}
        title="Thêm user"
        subtitle="Tạo tài khoản nhân viên mới"
        closeable="close_button"
        width="md"
        onClose={onClose}
      >
        <form className="core_modal__form" onSubmit={onSubmit}>
          <label>
            Họ và tên
            <input name="full_name" type="text" required placeholder="Nguyễn Văn A" />
          </label>
          <label>
            Tên đăng nhập
            <input name="username" type="text" required placeholder="nguyenvana" />
          </label>
          <label>
            Mật khẩu
            <input name="password" type="password" required placeholder="••••••••" />
          </label>
          <label>
            Số điện thoại
            <input name="phone" type="tel" placeholder="0901234567" />
          </label>
          <label>
            Địa chỉ
            <input name="address" type="text" placeholder="Hà Nội" />
          </label>
          {error && <p className="core_modal__error">{error}</p>}
          <div className="core_modal__actions">
            <button
              type="button"
              className="core_modal__btn core_modal__btn--secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button type="submit" className="core_modal__btn core_modal__btn--primary" disabled={loading}>
              {loading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
