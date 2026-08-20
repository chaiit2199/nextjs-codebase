"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import type { Department, User } from "@/lib/api/me";
import { UserAvatar } from "@/server_component/users/user-components";
import { Icon } from "@/components/icon";
import { UserStatus, userStatusMeta } from "@/components/users/status";
import { Input, Modal } from "@/components/core_component";
import { updateUser } from "@/lib/auth/users";
import { putFlash } from "@/lib/flash";

type PendingUserUpdate = {
    full_name?: string;
    phone?: string;
    email?: string;
    status?: number;
    department?: number;
    address?: string;
};

function compactUserUpdate(data: FormData): PendingUserUpdate {
    const payload: PendingUserUpdate = {};
    const text = (name: string) => String(data.get(name) ?? "").trim();

    const full_name = text("full_name");
    const phone = text("phone");
    const email = text("email");
    const address = text("address");
    const status = Number(data.get("status"));
    const department = Number(data.get("department"));

    if (full_name) payload.full_name = full_name;
    if (phone) payload.phone = phone;
    if (email) payload.email = email;
    if (address) payload.address = address;
    if (Number.isFinite(status)) payload.status = status;
    if (Number.isFinite(department) && department > 0) payload.department = department;

    return payload;
}

export function UsersTable({ users, departments }: { users: User[]; departments: Department[] }) {
    console.log(users);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [modal, setModal] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [pending, setPending] = useState<PendingUserUpdate | null>(null);

    function openUser(user: User) {
        console.log(user);
        setCurrentUser(user);
        setModal(true);
    }

    function closeModal() {
        if (saving) return;
        setPending(null);
        setConfirmOpen(false);
        setModal(false);
        setCurrentUser(null);
    }

    function onCloseConfirm() {
        if (saving) return;
        setConfirmOpen(false);
    }

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setPending(compactUserUpdate(new FormData(event.currentTarget)));
        setConfirmOpen(true);
    }

    async function handleUpdateUser(payload: PendingUserUpdate) {
        if (!currentUser?.id) return { ok: false as const, message: "Không tìm thấy nhân viên" };

        return updateUser({
            id: Number(currentUser.id),
            ...payload,
        });
    }

    async function onConfirm() {
        if (!pending || !currentUser?.id || saving) return;

        setSaving(true);
        const result = await handleUpdateUser(pending);
        setSaving(false);

        if (!result?.ok) {
            setConfirmOpen(false);
            putFlash("error", result?.message ?? "Không thể cập nhật nhân viên", 2000);
            return;
        }

        setPending(null);
        setConfirmOpen(false);
        setModal(false);
        setCurrentUser(null);
        putFlash("success", "Cập nhật nhân viên thành công", 2000);
    }

    return (
        <>
            <section className="admin-section" id="admin-users-section">
                <div className="admin-table-card mb-6">
                    <div className="overview-table-wrap">
                        <table className="overview-table" id="users-table">
                            <thead>
                                <tr>
                                <th>Tên</th>
                                <th>Tên đăng nhập</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Phòng ban</th>
                                <th>Trạng thái</th>
                                <th className="actions" />
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                <tr key={user.id} id={`user-row-${user.id}`}>
                                    <td>
                                    <div className="admin-user">
                                        <UserAvatar fullname={user.full_name} />
                                        <p className="admin-user__name">{user.full_name}</p>
                                    </div>
                                    </td>
                                    <td className="overview-table__muted">{user.username}</td>
                                    <td className="overview-table__muted">{user.phone}</td>
                                    <td className="overview-table__muted">{user.address}</td>
                                    <td className="overview-table__muted">{user.department ?? "—"}</td>
                                    <td>
                                    <UserStatusBadge status={user.status} />
                                    </td>
                                    <td className="actions">
                                    <div className="admin-actions">
                                        <button
                                            type="button"
                                            className="admin-actions__btn"
                                            aria-label="Chỉnh sửa"
                                            onClick={() => openUser(user)}
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
                    id="user-details-modal"
                    show={modal && currentUser !== null}
                    title="Chi tiết nhân viên"
                    closeable={confirmOpen ? false : "close_button"}
                    width="lg"
                    onClose={closeModal}
                >
                    {currentUser && (
                        <form
                            key={currentUser.id}
                            id="user-details-form"
                            className="core_modal__form overflow-hidden"
                            autoComplete="off"
                            onSubmit={onSubmit}
                        >
                            <div className="admin-user-form gap-4 overflow-y-auto flex-auto h-full">
                                <Input
                                    id="user-username"
                                    name="username"
                                    label={<RequiredLabel>Tên đăng nhập</RequiredLabel>}
                                    defaultValue={currentUser.username}
                                    readOnly
                                />
                                <Input
                                    id="user-full-name"
                                    name="full_name"
                                    label={<RequiredLabel>Họ và tên</RequiredLabel>}
                                    defaultValue={currentUser.full_name}
                                />
                                <Input
                                    id="user-phone"
                                    name="phone"
                                    label={<RequiredLabel>Số điện thoại</RequiredLabel>}
                                    defaultValue={currentUser.phone}
                                />
                                <Input
                                    id="user-email"
                                    name="email"
                                    type="email"
                                    label={<RequiredLabel>Email</RequiredLabel>}
                                    placeholder="Email"
                                    defaultValue={currentUser.email ?? ""}
                                />
                                <SelectField
                                    id="user-status"
                                    name="status"
                                    label={<RequiredLabel>Trạng thái</RequiredLabel>}
                                    defaultValue={String(currentUser.status ?? UserStatus.Active)}
                                >
                                    <option value={UserStatus.Active}>
                                        {userStatusMeta(UserStatus.Active).label}
                                    </option>
                                    <option value={UserStatus.Inactive}>
                                        {userStatusMeta(UserStatus.Inactive).label}
                                    </option>
                                </SelectField>
                                <SelectField
                                    id="user-department"
                                    name="department"
                                    label={<RequiredLabel>Phòng ban</RequiredLabel>}
                                    defaultValue={selectedDepartmentId(currentUser.department, departments)}
                                >
                                    <option value="" disabled>
                                        Chọn phòng ban
                                    </option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </SelectField>
                                <div className="admin-user-form__full">
                                    <Input
                                        id="user-address"
                                        name="address"
                                        label={<RequiredLabel>Địa chỉ</RequiredLabel>}
                                        placeholder="Địa chỉ"
                                        defaultValue={currentUser.address ?? ""}
                                    />
                                </div>
                            </div>

                            <div className="core_modal__actions">
                                <button type="button" className="core_button core_button--secondary" onClick={closeModal}>
                                    Hủy
                                </button>
                                <button type="submit" className="core_button core_button--primary">
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>


                <Modal
                    id="user-details-confirm-modal"
                    show={confirmOpen}
                    title="Xác nhận cập nhật nhân viên"
                    closeable={saving ? false : "close_button"}
                    width="md"
                    className="core_modal--stacked"
                    onClose={onCloseConfirm}
                >
                    <div className="core_modal__actions">
                    <button
                        type="button"
                        id="user-details-confirm-cancel"
                        className="core_button core_button--secondary"
                        disabled={saving}
                        onClick={onCloseConfirm}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        id="user-details-confirm-submit"
                        className="core_button core_button--primary"
                        disabled={saving}
                        onClick={onConfirm}
                    >
                        {saving ? "Đang lưu..." : "Xác nhận"}
                    </button>
                    </div>
                </Modal>
        </>
    );
}

function RequiredLabel({ children }: { children: string }) {
    return (
        <>
            {children} <span className="core_label__required">*</span>
        </>
    );
}

function selectedDepartmentId(department: User["department"], departments: Department[]) {
    if (department == null || department === "") return "";

    const matched = departments.find(
        (item) => item.name === department || String(item.id) === String(department) || item.code === department,
    );

    return matched ? String(matched.id) : "";
}

function SelectField({
    id,
    name,
    label,
    defaultValue,
    required,
    children,
}: {
    id: string;
    name: string;
    label: ReactNode;
    defaultValue?: string;
    required?: boolean;
    children: ReactNode;
}) {
    return (
        <div className="core_field">
            <label htmlFor={id} className="core_label">
                {label}
            </label>
            <select
                id={id}
                name={name}
                defaultValue={defaultValue}
                required={required}
                className="core_input core_input--select w-full"
            >
                {children}
            </select>
        </div>
    );
}

function UserStatusBadge({ status }: { status?: number }) {
    const meta = userStatusMeta(status);

    return (
      <span className={`admin-status admin-status--${meta.kind}`}>
        {meta.label}
      </span>
    );
}
