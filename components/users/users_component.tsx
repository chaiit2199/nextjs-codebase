"use client";

import { useState, type FormEvent } from "react";

import type { Department, User } from "@/lib/api/me";
import { UserAvatar } from "@/server_component/users/user-components";
import { Icon } from "@/components/icon";
import { UserStatus, userStatusMeta } from "@/components/users/status";
import { RequiredLabel, SelectField } from "@/components/users/user-form";
import { Input, Modal } from "@/components/core_component";
import { updateUser } from "@/lib/api/users";
import { putFlash } from "@/lib/flash";

type UpdateUserEntity = {
    full_name?: string;
    phone?: string;
    email?: string;
    status?: number;
    department_id?: number;
    address?: string;
};

function handleValidate(data: FormData): UpdateUserEntity {
    const draft: UpdateUserEntity = {};
    const text = (name: string) => String(data.get(name) ?? "").trim();

    const fullName = text("full_name");
    const phone = text("phone");
    const email = text("email");
    const address = text("address");
    const status = Number(data.get("status"));
    const departmentId = Number(data.get("department_id"));

    if (fullName) draft.full_name = fullName;
    if (phone) draft.phone = phone;
    if (email) draft.email = email;
    if (address) draft.address = address;
    if (Number.isFinite(status)) draft.status = status;
    if (Number.isFinite(departmentId) && departmentId > 0) draft.department_id = departmentId;

    return draft;
}

export function UsersComponent({ users, departments }: { users: User[]; departments: Department[]}) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draft, setDraft] = useState<UpdateUserEntity | null>(null);

    function openEditForm(user: User) {
        setSelectedUser(user);
        setDraft(null);
        setIsConfirmOpen(false);
        setIsFormOpen(true);
    }

    function resetForm() {
        setDraft(null);
        setIsConfirmOpen(false);
        setIsFormOpen(false);
        setSelectedUser(null);
    }

    function closeForm() {
        if (isSaving) return;
        resetForm();
    }

    function closeConfirm() {
        if (isSaving) return;
        setIsConfirmOpen(false);
    }

    function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setDraft(handleValidate(new FormData(event.currentTarget)));
        setIsConfirmOpen(true);
    }

    async function confirmUpdate() {
        if (!draft || !selectedUser?.id || isSaving) return;

        setIsSaving(true);
            const result = await updateUser({
            id: Number(selectedUser.id),
            ...draft,
        });
        setIsSaving(false);

        if (!result.ok) {
            setIsConfirmOpen(false);
            putFlash("error", result.message, 2000);
            return;
        }

        resetForm();
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
                                            onClick={() => openEditForm(user)}
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
                id="update-user-modal"
                show={isFormOpen && selectedUser !== null}
                title="Chi tiết nhân viên"
                closeable={isConfirmOpen ? false : "close_button"}
                width="lg"
                onClose={closeForm}
            >
                {selectedUser && (
                <form
                    key={selectedUser.id}
                    id="update-user-form"
                    className="core_modal__form overflow-hidden"
                    autoComplete="off"
                    onSubmit={handleFormSubmit}
                >
                    <div className="admin-user-form gap-4 overflow-y-auto flex-auto h-full">
                    <Input
                        id="update-user-username"
                        name="username"
                        label={<RequiredLabel>Tên đăng nhập</RequiredLabel>}
                        defaultValue={selectedUser.username}
                        readOnly
                    />
                    <Input
                        id="update-user-full-name"
                        name="full_name"
                        label={<RequiredLabel>Họ và tên</RequiredLabel>}
                        defaultValue={selectedUser.full_name}
                    />
                    <Input
                        id="update-user-phone"
                        name="phone"
                        label={<RequiredLabel>Số điện thoại</RequiredLabel>}
                        defaultValue={selectedUser.phone}
                    />
                    <Input
                        id="update-user-email"
                        name="email"
                        type="email"
                        label={<RequiredLabel>Email</RequiredLabel>}
                        placeholder="Email"
                        defaultValue={selectedUser.email ?? ""}
                    />
                    <SelectField
                        id="update-user-status"
                        name="status"
                        label={<RequiredLabel>Trạng thái</RequiredLabel>}
                        defaultValue={String(selectedUser.status ?? UserStatus.Active)}
                    >
                        <option value={UserStatus.Active}>{userStatusMeta(UserStatus.Active).label}</option>
                        <option value={UserStatus.Inactive}>{userStatusMeta(UserStatus.Inactive).label}</option>
                    </SelectField>
                    <SelectField
                        id="update-user-department"
                        name="department_id"
                        label={<RequiredLabel>Phòng ban</RequiredLabel>}
                        defaultValue={departmentOptionValue(selectedUser.department, departments)}
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
                        id="update-user-address"
                        name="address"
                        label={<RequiredLabel>Địa chỉ</RequiredLabel>}
                        placeholder="Địa chỉ"
                        defaultValue={selectedUser.address ?? ""}
                        />
                    </div>
                    </div>

                    <div className="core_modal__actions">
                    <button type="button" className="core_button core_button--secondary" onClick={closeForm}>
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
                id="update-user-confirm-modal"
                show={isConfirmOpen}
                title="Xác nhận cập nhật nhân viên"
                closeable={isSaving ? false : "close_button"}
                width="md"
                className="core_modal--stacked"
                onClose={closeConfirm}
            >
                <div className="core_modal__actions">
                <button
                    type="button"
                    className="core_button core_button--secondary"
                    disabled={isSaving}
                    onClick={closeConfirm}
                >
                    Hủy
                </button>
                <button
                    type="button"
                    className="core_button core_button--primary"
                    disabled={isSaving}
                    onClick={confirmUpdate}
                >
                    {isSaving ? "Đang lưu..." : "Xác nhận"}
                </button>
                </div>
            </Modal>
        </>
    );
}

function departmentOptionValue(department: User["department"], departments: Department[]) {
    if (department == null || department === "") return "";

    const matched = departments.find(
        (item) => item.name === department || String(item.id) === String(department) || item.code === department,
    );

    return matched ? String(matched.id) : "";
}

function UserStatusBadge({ status }: { status?: number }) {
    const meta = userStatusMeta(status);

    return (
        <span className={`admin-status admin-status--${meta.kind}`}>
        {meta.label}
        </span>
    );
}
